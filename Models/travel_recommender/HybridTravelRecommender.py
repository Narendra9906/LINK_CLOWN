import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
import pickle
import os

class HybridTravelRecommender:
    def __init__(self, data_dir='data/'):
        """
        Initialize the hybrid recommender system.

        Args:
            data_dir: Directory containing the CSV files
        """
        self.data_dir = data_dir
        self.users_df = None
        self.destinations_df = None
        self.interactions_df = None
        self.features_df = None
        self.accommodations_df = None
        self.seasonal_df = None

        self.content_model = None
        self.collaborative_model = None
        self.user_item_matrix = None
        self.destination_similarity_matrix = None

        # Hyperparameters for hybrid weighting
        self.cf_weight = 0.5  # Weight for collaborative filtering
        self.cb_weight = 0.1  # Weight for content-based filtering

    def load_data(self):
        """Load all necessary datasets"""
        # Load datasets
        self.users_df = pd.read_csv(os.path.join(self.data_dir, 'users.csv'))
        self.destinations_df = pd.read_csv(os.path.join(self.data_dir, 'destinations.csv'))
        self.interactions_df = pd.read_csv(os.path.join(self.data_dir, 'interactions.csv'))
        self.features_df = pd.read_csv(os.path.join(self.data_dir, 'place_features.csv'))
        self.accommodations_df = pd.read_csv(os.path.join(self.data_dir, 'accommodations.csv'))
        self.seasonal_df = pd.read_csv(os.path.join(self.data_dir, 'seasonal_data.csv'))

        print("Data loaded successfully!")
        print(f"Users: {len(self.users_df)}")
        print(f"Destinations: {len(self.destinations_df)}")
        print(f"Interactions: {len(self.interactions_df)}")

        # Create user-item rating matrix for collaborative filtering
        self._create_user_item_matrix()

        return self

    def _create_user_item_matrix(self):
        """Create user-item interaction matrix from interactions data"""
        # Using ratings as primary interaction value
        self.user_item_matrix = self.interactions_df.pivot(
            index='user_id',
            columns='destination_id',
            values='rating'
        ).fillna(0)

        return self.user_item_matrix

    def train_content_based_model(self):
        """Train the content-based filtering model"""
        print("Training content-based model...")

        # Normalize feature values
        scaler = MinMaxScaler()
        feature_cols = self.features_df.columns[1:]  # Exclude destination_id
        normalized_features = scaler.fit_transform(self.features_df[feature_cols])

        # Calculate destination similarity matrix using cosine similarity
        self.destination_similarity_matrix = cosine_similarity(normalized_features)

        # Create a mapping from destination_id to matrix index
        self.dest_id_to_idx = {
            dest_id: idx for idx, dest_id in enumerate(self.features_df['destination_id'])
        }
        self.idx_to_dest_id = {
            idx: dest_id for dest_id, idx in self.dest_id_to_idx.items()
        }

        print("Content-based model trained successfully!")
        return self

    def train_collaborative_model(self):
        """Train the collaborative filtering model using Surprise library"""
        print("Training collaborative filtering model...")

        # Prepare data for Surprise
        reader = Reader(rating_scale=(1, 5))
        data = Dataset.load_from_df(
            self.interactions_df[['user_id', 'destination_id', 'rating']],
            reader
        )

        # Split into training and testing sets
        trainset, testset = train_test_split(data, test_size=0.2)

        # Train the SVD model (Matrix Factorization)
        self.collaborative_model = SVD(n_factors=50, n_epochs=20, verbose=True)
        self.collaborative_model.fit(trainset)

        print("Collaborative filtering model trained successfully!")
        return self

    def _get_content_based_recommendations(self, user_id, user_preferences, top_n=10):
        """
        Generate content-based recommendations based on user preferences

        Args:
            user_id: ID of the user
            user_preferences: Dictionary containing user preferences
            top_n: Number of recommendations to return

        Returns:
            DataFrame of recommended destinations
        """
        # Extract user preferences
        preferred_type = user_preferences.get('place_type', None)
        accommodation_type = user_preferences.get('accommodation_type', None)
        user_type = user_preferences.get('user_type', None)

        # Filter destinations based on user preferences
        filtered_destinations = self.destinations_df.copy()

        if preferred_type:
            filtered_destinations = filtered_destinations[
                filtered_destinations['place_type'] == preferred_type
            ]

        # Get previously visited destinations
        visited_destinations = set(
            self.interactions_df[
                (self.interactions_df['user_id'] == user_id) &
                (self.interactions_df['visited'] == 1)
            ]['destination_id']
        )

        # Filter out already visited places
        if visited_destinations:
            filtered_destinations = filtered_destinations[
                ~filtered_destinations['destination_id'].isin(visited_destinations)
            ]

        # If no destinations left after filtering, use all destinations
        if filtered_destinations.empty:
            filtered_destinations = self.destinations_df[
                ~self.destinations_df['destination_id'].isin(visited_destinations)
            ]

        # Calculate preference score for each destination
        scores = []

        for _, dest in filtered_destinations.iterrows():
            dest_id = dest['destination_id']

            # Base score from place type match
            score = 0
            if preferred_type and dest['place_type'] == preferred_type:
                score += 2

            # Add score from destination popularity
            score += dest['popularity_score'] / 10

            # Add accommodation matching score
            if accommodation_type:
                matching_accommodations = self.accommodations_df[
                    (self.accommodations_df['destination_id'] == dest_id) &
                    (self.accommodations_df['type'] == accommodation_type)
                ]
                if not matching_accommodations.empty:
                    score += 1

            # Check if suitable for user type (student or professional)
            if user_type == 'student' and dest['avg_cost_per_day'] < 3000:
                score += 1
            elif user_type == 'professional' and dest['avg_cost_per_day'] >= 3000:
                score += 0.5

            scores.append((dest_id, score))

        # Sort by score and get top recommendations
        scores.sort(key=lambda x: x[1], reverse=True)
        top_dest_ids = [dest_id for dest_id, _ in scores[:top_n]]

        # Get full destination details
        recommendations = self.destinations_df[
            self.destinations_df['destination_id'].isin(top_dest_ids)
        ].copy()

        # Add score to recommendations
        score_dict = {dest_id: score for dest_id, score in scores if dest_id in top_dest_ids}
        recommendations['cb_score'] = recommendations['destination_id'].map(score_dict)

        return recommendations.sort_values('cb_score', ascending=False)

    def _get_collaborative_recommendations(self, user_id, top_n=10):
        """
        Generate collaborative filtering recommendations

        Args:
            user_id: ID of the user
            top_n: Number of recommendations to return

        Returns:
            DataFrame of recommended destinations
        """
        # Get all destinations
        all_destinations = self.destinations_df['destination_id'].unique()

        # Get already visited destinations
        visited_destinations = set(
            self.interactions_df[
                (self.interactions_df['user_id'] == user_id) &
                (self.interactions_df['visited'] == 1)
            ]['destination_id']
        )

        # Filter out visited destinations
        candidate_destinations = [
            dest_id for dest_id in all_destinations
            if dest_id not in visited_destinations
        ]

        # Predict ratings for all candidate destinations
        predicted_ratings = []

        for dest_id in candidate_destinations:
            predicted_rating = self.collaborative_model.predict(user_id, dest_id).est
            predicted_ratings.append((dest_id, predicted_rating))

        # Sort by predicted rating and get top recommendations
        predicted_ratings.sort(key=lambda x: x[1], reverse=True)
        top_dest_ids = [dest_id for dest_id, _ in predicted_ratings[:top_n]]

        # Get full destination details
        recommendations = self.destinations_df[
            self.destinations_df['destination_id'].isin(top_dest_ids)
        ].copy()

        # Add predicted rating to recommendations
        rating_dict = {
            dest_id: rating for dest_id, rating in predicted_ratings
            if dest_id in top_dest_ids
        }
        recommendations['cf_score'] = recommendations['destination_id'].map(rating_dict)

        return recommendations.sort_values('cf_score', ascending=False)

    def get_hybrid_recommendations(self, user_id, user_preferences=None, top_n=10):
        """
        Generate hybrid recommendations combining content-based and collaborative filtering

        Args:
            user_id: ID of the user
            user_preferences: Dictionary containing user preferences
            top_n: Number of recommendations to return

        Returns:
            DataFrame of recommended destinations
        """
        # Check if user exists in interactions
        user_exists = user_id in self.interactions_df['user_id'].unique()

        # If user_preferences is None, create empty dict
        if user_preferences is None:
            user_preferences = {}

            # Try to get user preferences from users_df
            if user_id in self.users_df['user_id'].values:
                user_data = self.users_df[self.users_df['user_id'] == user_id].iloc[0]
                user_preferences['user_type'] = user_data['user_type']
                user_preferences['accommodation_type'] = user_data['preferred_accommodation']

        # For new users or users with very few interactions, rely more on content-based
        if not user_exists:
            print(f"User {user_id} is new. Using content-based recommendations.")
            cb_weight = 1.0
            cf_weight = 0.0
        else:
            interaction_count = self.interactions_df[
                self.interactions_df['user_id'] == user_id
            ].shape[0]

            # Adjust weights based on interaction count
            if interaction_count < 3:
                cb_weight = 0.3
                cf_weight = 0.1
            else:
                cb_weight = self.cb_weight
                cf_weight = self.cf_weight

        # Get content-based recommendations
        cb_recommendations = self._get_content_based_recommendations(
            user_id, user_preferences, top_n=top_n*2
        )

        # For existing users, get collaborative filtering recommendations
        if user_exists and cf_weight > 0:
            cf_recommendations = self._get_collaborative_recommendations(
                user_id, top_n=top_n*2
            )

            # Merge recommendations
            merged_recommendations = pd.merge(
                cb_recommendations,
                cf_recommendations[['destination_id', 'cf_score']],
                on='destination_id',
                how='outer'
            ).fillna(0)

            # Calculate hybrid score
            merged_recommendations['hybrid_score'] = (
                cb_weight * merged_recommendations['cb_score'] +
                cf_weight * merged_recommendations['cf_score']
            )
        else:
            # For new users, only use content-based
            merged_recommendations = cb_recommendations.copy()
            merged_recommendations['cf_score'] = 0
            merged_recommendations['hybrid_score'] = merged_recommendations['cb_score']

        # Sort by hybrid score and get top recommendations
        final_recommendations = merged_recommendations.sort_values(
            'hybrid_score', ascending=False
        ).head(top_n)

        return final_recommendations

    def save_models(self, filepath='models/'):
        """Save trained models to disk"""
        os.makedirs(filepath, exist_ok=True)

        # Save content-based model components
        if self.destination_similarity_matrix is not None:
            np.save(
                os.path.join(filepath, 'destination_similarity_matrix.npy'),
                self.destination_similarity_matrix
            )
            with open(os.path.join(filepath, 'dest_id_mapping.pkl'), 'wb') as f:
                pickle.dump({
                    'dest_id_to_idx': self.dest_id_to_idx,
                    'idx_to_dest_id': self.idx_to_dest_id
                }, f)

        # Save collaborative model
        if self.collaborative_model is not None:
            with open(os.path.join(filepath, 'collaborative_model.pkl'), 'wb') as f:
                pickle.dump(self.collaborative_model, f)

        print(f"Models saved to {filepath}")

    def load_models(self, filepath='models/'):
        """Load trained models from disk"""
        # Load content-based model components
        try:
            self.destination_similarity_matrix = np.load(
                os.path.join(filepath, 'destination_similarity_matrix.npy')
            )
            with open(os.path.join(filepath, 'dest_id_mapping.pkl'), 'rb') as f:
                mapping = pickle.load(f)
                self.dest_id_to_idx = mapping['dest_id_to_idx']
                self.idx_to_dest_id = mapping['idx_to_dest_id']
        except FileNotFoundError:
            print("Content-based model files not found.")

        # Load collaborative model
        try:
            with open(os.path.join(filepath, 'collaborative_model.pkl'), 'rb') as f:
                self.collaborative_model = pickle.load(f)
        except FileNotFoundError:
            print("Collaborative model file not found.")

        return self
