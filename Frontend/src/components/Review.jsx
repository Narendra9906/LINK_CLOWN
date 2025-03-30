import React from 'react'

const Review = ({
    name,
    review,
    rating,
    avatar
}) => {

  return (
    <div>
        {name}
        {review}
        {rating}
        {avatar}
    </div>
  )
}

export default Review