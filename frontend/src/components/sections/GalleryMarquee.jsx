import { useState } from 'react'
import { motion } from 'framer-motion'

const GalleryMarquee = () => {
  // First row - 40 images moving right-to-left
  const [firstRowImages] = useState([
    { id: 1, src: '/images/image1.jpeg', alt: 'Image 1' },
    { id: 2, src: '/images/image3.jpeg', alt: 'Image 2' },
    { id: 3, src: '/images/image4.jpeg', alt: 'Image 3' },
    { id: 4, src: '/images/image5.jpeg', alt: 'Image 4' },
    { id: 5, src: '/images/image6.jpeg', alt: 'Image 5' },
    { id: 6, src: '/images/image7.jpeg', alt: 'Image 6' },
    { id: 7, src: '/images/image8.jpeg', alt: 'Image 7' },
    { id: 8, src: '/images/image9.jpeg', alt: 'Image 8' },
    { id: 9, src: '/images/image010.jpeg', alt: 'Image 9' },
    { id: 10, src: '/images/image13.jpeg', alt: 'Image 10' },
    { id: 11, src: '/images/gallery1.png', alt: 'Fellowship Gathering' },
    { id: 12, src: '/images/gallery2.png', alt: 'Sunday School' },
    { id: 13, src: '/images/gallery3.png', alt: 'Mission Trip' },
    { id: 14, src: '/images/gallery4.png', alt: 'Church Conference' },
    { id: 15, src: '/images/gallery5.png', alt: 'Praise & Worship' },
    { id: 16, src: '/images/gallery6.png', alt: 'Church Leadership' },
    { id: 17, src: '/images/gallery7.png', alt: 'Church Service 2' },
    { id: 18, src: '/images/gallery8.png', alt: 'Worship Session 2' },
    { id: 19, src: '/images/gallery9.png', alt: 'Community Event 2' },
    { id: 20, src: '/images/gallery10.png', alt: 'Church Service' },
    { id: 21, src: '/images/gallery11.png', alt: 'Worship Session' },
    { id: 22, src: '/images/gallery12.png', alt: 'Community Event' },
    { id: 23, src: '/images/gallery13.png', alt: 'Youth Ministry' },
    { id: 24, src: '/images/gallery14.png', alt: 'Prayer Meeting' },
    { id: 25, src: '/images/gallery15.png', alt: 'Church Building' },
    { id: 26, src: '/images/gallery16.png', alt: 'Choir Performance' },
    { id: 27, src: '/images/gallery17.jpeg', alt: 'Bible Study' },
    { id: 28, src: '/images/gallery18.jpeg', alt: 'Outreach Program' },
    { id: 29, src: '/images/gallery19.jpeg', alt: 'Fellowship Gathering' },
    { id: 30, src: '/images/gallery20.jpeg', alt: 'Sunday School' },
    { id: 31, src: '/images/gallery21.jpeg', alt: 'Mission Trip' },
    { id: 32, src: '/images/gallery22.jpeg', alt: 'Church Conference' },
    { id: 33, src: '/images/gallery23.jpeg', alt: 'Praise & Worship' },
    { id: 34, src: '/images/gallery24.jpeg', alt: 'Church Leadership' },
    { id: 35, src: '/images/gallery25.jpeg', alt: 'Church Service 2' },
    { id: 36, src: '/images/gallery26.jpeg', alt: 'Worship Session 2' },
    { id: 37, src: '/images/gallery27.jpeg', alt: 'Community Event 2' },
    { id: 38, src: '/images/gallery28.jpeg', alt: 'Baptism Ceremony 2' },
    { id: 39, src: '/images/gallery29.jpeg', alt: 'Community Event 2' },
    { id: 40, src: '/images/gallery30.jpeg', alt: 'Baptism Ceremony 2' }
  ])

  // Second row - 40 images moving left-to-right
  const [secondRowImages] = useState([
    { id: 1, src: '/images/gallery30.jpeg', alt: 'Church Service' },
    { id: 2, src: '/images/gallery29.jpeg', alt: 'Worship Session' },
    { id: 3, src: '/images/gallery28.jpeg', alt: 'Community Event' },
    { id: 4, src: '/images/gallery27.jpeg', alt: 'Baptism Ceremony' },
    { id: 5, src: '/images/gallery26.jpeg', alt: 'Youth Ministry' },
    { id: 6, src: '/images/gallery25.jpeg', alt: 'Prayer Meeting' },
    { id: 7, src: '/images/gallery24.jpeg', alt: 'Church Building' },
    { id: 8, src: '/images/gallery23.jpeg', alt: 'Choir Performance' },
    { id: 9, src: '/images/gallery22.jpeg', alt: 'Bible Study' },
    { id: 10, src: '/images/gallery21.jpeg', alt: 'Outreach Program' },
    { id: 11, src: '/images/gallery20.jpeg', alt: 'Fellowship Gathering' },
    { id: 12, src: '/images/gallery19.jpeg', alt: 'Sunday School' },
    { id: 13, src: '/images/gallery18.jpeg', alt: 'Mission Trip' },
    { id: 14, src: '/images/gallery17.jpeg', alt: 'Church Conference' },
    { id: 15, src: '/images/gallery16.png', alt: 'Praise & Worship' },
    { id: 16, src: '/images/gallery15.png', alt: 'Church Leadership' },
    { id: 17, src: '/images/gallery14.png', alt: 'Church Service 2' },
    { id: 18, src: '/images/gallery13.png', alt: 'Worship Session 2' },
    { id: 19, src: '/images/gallery12.png', alt: 'Community Event 2' },
    { id: 20, src: '/images/gallery11.png', alt: 'Baptism Ceremony 2' },
    { id: 21, src: '/images/gallery10.png', alt: 'Sunday School' },
    { id: 22, src: '/images/gallery9.png', alt: 'Mission Trip' },
    { id: 23, src: '/images/gallery8.png', alt: 'Church Conference' },
    { id: 24, src: '/images/gallery7.png', alt: 'Praise & Worship' },
    { id: 25, src: '/images/gallery6.png', alt: 'Church Leadership' },
    { id: 26, src: '/images/gallery5.png', alt: 'Church Service 2' },
    { id: 27, src: '/images/gallery4.png', alt: 'Worship Session 2' },
    { id: 28, src: '/images/gallery3.png', alt: 'Community Event 2' },
    { id: 29, src: '/images/gallery2.png', alt: 'Worship Session 2' },
    { id: 30, src: '/images/gallery1.png', alt: 'Community Event 2' },
    { id: 31, src: '/images/image14.jpeg', alt: 'Image 1' },
    { id: 32, src: '/images/image15.jpeg', alt: 'Image 2' },
    { id: 33, src: '/images/image16.jpeg', alt: 'Image 3' },
    { id: 34, src: '/images/image17.jpeg', alt: 'Image 4' },
    { id: 35, src: '/images/image18.jpeg', alt: 'Image 5' },
    { id: 36, src: '/images/image19.jpeg', alt: 'Image 6' },
    { id: 37, src: '/images/image20.jpeg', alt: 'Image 7' },
    { id: 38, src: '/images/image21.jpeg', alt: 'Image 8' },
    { id: 39, src: '/images/image3.jpeg', alt: 'Image 9' },
    { id: 40, src: '/images/image4.jpeg', alt: 'Image 10' }
  ])

  // Calculate total width for seamless loop
  const firstRowWidth = firstRowImages.length * (200 + 20) // 200px width + 20px gap
  const secondRowWidth = secondRowImages.length * (200 + 20)

  return (
    <div style={{ padding: '60px 0' }}>
      {/* Section Title */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#666',
          marginBottom: '10px',
          fontFamily: 'serif'
        }}>
          Doxa
        </h2>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#ffffff',
          fontWeight: 'bold'
        }}>
          Captured in Glory
        </p>
      </div>
      
      {/* First Row - 40 images moving right-to-left */}
      <div style={{ 
        overflow: 'hidden',
        marginBottom: '20px',
        width: '100%'
      }}>
        <motion.div
          animate={{
            x: [0, -firstRowWidth]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 150,
              ease: "linear",
            }
          }}
          style={{ 
            display: 'flex', 
            gap: '20px',
            width: `${firstRowWidth * 2}px` // Double width for seamless loop
          }}
        >
          {[...firstRowImages, ...firstRowImages].map((image, index) => (
            <img 
              key={`first-${image.id}-${index}`}
              src={image.src} 
              alt={image.alt}
              style={{ 
                width: '200px', 
                height: '150px',
                objectFit: 'cover',
                flexShrink: 0
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Second Row - 40 images moving left-to-right */}
      <div style={{ 
        overflow: 'hidden',
        width: '100%'
      }}>
        <motion.div
          animate={{
            x: [-secondRowWidth, 0]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 150,
              ease: "linear",
            }
          }}
          style={{ 
            display: 'flex', 
            gap: '20px',
            width: `${secondRowWidth * 2}px` // Double width for seamless loop
          }}
        >
          {[...secondRowImages, ...secondRowImages].map((image, index) => (
            <img 
              key={`second-${image.id}-${index}`}
              src={image.src} 
              alt={image.alt}
              style={{ 
                width: '200px', 
                height: '150px',
                objectFit: 'cover',
                flexShrink: 0
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default GalleryMarquee
