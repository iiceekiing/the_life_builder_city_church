import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const HomeImageFlow = () => {
  const [firstRowImages] = useState([
    { id: 1, src: '/images/gallery1.png', alt: 'Church Service' },
    { id: 3, src: '/images/gallery3.png', alt: 'Community Event' },
    { id: 4, src: '/images/gallery4.png', alt: 'Baptism Ceremony' },
    { id: 5, src: '/images/gallery5.png', alt: 'Youth Ministry' },
    { id: 6, src: '/images/gallery6.png', alt: 'Prayer Meeting' },
    { id: 7, src: '/images/gallery7.png', alt: 'Church Building' },
    { id: 8, src: '/images/gallery8.png', alt: 'Choir Performance' },
    { id: 9, src: '/images/gallery9.png', alt: 'Bible Study' },
    { id: 10, src: '/images/gallery10.png', alt: 'Outreach Program' },
    { id: 11, src: '/images/gallery11.png', alt: 'Fellowship Gathering' },
    { id: 12, src: '/images/gallery12.png', alt: 'Sunday School' },
    { id: 13, src: '/images/gallery13.png', alt: 'Mission Trip' },
    { id: 14, src: '/images/gallery14.png', alt: 'Church Conference' },
    { id: 15, src: '/images/gallery15.png', alt: 'Praise & Worship' },
    { id: 16, src: '/images/gallery16.png', alt: 'Church Leadership' },
    { id: 17, src: '/images/gallery17.jpeg', alt: 'Church Service 2' },
    { id: 18, src: '/images/gallery18.jpeg', alt: 'Worship Session 2' },
    { id: 19, src: '/images/gallery19.jpeg', alt: 'Community Event 2' },
    { id: 20, src: '/images/gallery20.jpeg', alt: 'Baptism Ceremony 2' }
  ])

  const [secondRowImages] = useState([
    { id: 21, src: '/images/gallery21.jpeg', alt: 'Church Service 3' },
    { id: 22, src: '/images/gallery22.jpeg', alt: 'Worship Session 3' },
    { id: 23, src: '/images/gallery23.jpeg', alt: 'Community Event 3' },
    { id: 24, src: '/images/gallery24.jpeg', alt: 'Baptism Ceremony 3' },
    { id: 25, src: '/images/gallery25.jpeg', alt: 'Youth Ministry 2' },
    { id: 26, src: '/images/gallery26.jpeg', alt: 'Prayer Meeting 2' },
    { id: 27, src: '/images/gallery27.jpeg', alt: 'Church Building 2' },
    { id: 28, src: '/images/gallery28.jpeg', alt: 'Choir Performance 2' },
    { id: 29, src: '/images/gallery29.jpeg', alt: 'Bible Study 2' },
    { id: 30, src: '/images/gallery30.jpeg', alt: 'Outreach Program 2' }
  ])

  const rotationRef = useRef(0)
  const secondRotationRef = useRef(0)

  useEffect(() => {
    const rotationInterval = setInterval(() => {
      rotationRef.current += 0.5
      secondRotationRef.current += 0.5
    }, 50)

    return () => clearInterval(rotationInterval)
  }, [])

  return (
    <div>
      {/* First Row - Right to Left */}
      <motion.div
        animate={{ x: rotationRef.current * 0.5 }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
      >
        {firstRowImages.map((image, index) => (
          <img key={`${image}-${index}`} src={image.src} alt={image.alt} />
        ))}
      </motion.div>

      {/* Second Row - Left to Right */}
      <motion.div
        animate={{ x: secondRotationRef.current * 0.5 }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
      >
        {secondRowImages.map((image, index) => (
          <img key={`${image}-${index}`} src={image.src} alt={image.alt} />
        ))}
      </motion.div>
    </div>
  )
}

export default HomeImageFlow
