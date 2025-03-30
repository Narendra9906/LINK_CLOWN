from HybridTravelRecommender import HybridTravelRecommender

def test_recommender():
    # Initialize the recommender
    print("Initializing recommender...")
    recommender = HybridTravelRecommender()

    # Load data
    print("Loading data...")
    recommender.load_data()

    # Train models
    print("Training content-based model...")
    recommender.train_content_based_model()

    print("Training collaborative model...")
    recommender.train_collaborative_model()

    # Test with a new user
    print("\nTesting recommendations for a new user...")
    new_user_preferences = {
        'place_type': 'religious',
        'accommodation_type': 'hostel',
        'user_type': 'student'
    }
    new_user_recommendations = recommender.get_hybrid_recommendations(
        user_id=9999,  # New user ID
        user_preferences=new_user_preferences,
        top_n=3
    )
    print("Recommendations for new user:")
    print(new_user_recommendations[['destination_id', 'country', 'state', 'place_name', 'place_type', 'hybrid_score']])

    # Test with an existing user
    print("\nTesting recommendations for an existing user...")
    existing_user_recommendations = recommender.get_hybrid_recommendations(
        user_id=1001,  # Existing user ID
        top_n=3
    )
    print("Recommendations for existing user:")
    print(existing_user_recommendations[['destination_id', 'country', 'state', 'place_name', 'place_type', 'hybrid_score']])

    print("\nSaving models...")
    recommender.save_models()

    print("\nRecommendation system test completed successfully!")

if __name__ == "__main__":
    test_recommender()
