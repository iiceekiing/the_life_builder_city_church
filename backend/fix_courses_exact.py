from app.db.session import SessionLocal
from app.models.course import Course
from app.models.user import User

def update_courses_exact():
    db = SessionLocal()
    
    try:
        # Get admin user to set as instructor
        admin_user = db.query(User).filter(User.role == 'admin').first()
        
        # Delete all existing courses first
        db.query(Course).delete()
        print("Cleared all existing courses...")
        
        # Exact 6 courses as specified
        exact_courses = [
            {
                'title': 'Membership Class',
                'description': 'Rooted in the House - Becoming an Effective Member of God\'s Church\n\nThe Membership Class is a foundational training designed for every believer who desires to move beyond casual church attendance into meaningful, rooted membership in the Body of Christ. True membership in God\'s house is not merely having your name on a register - it is understanding your identity, your responsibilities, and your place within the covenant community of believers.\n\nThrough this course, participants will discover the biblical foundation of the local church, the rights and responsibilities of membership, the culture and values of Life Builder City Church, and how to actively contribute to the growth and health of the Body. You will learn how to align your personal life with the rhythm of the house, honour spiritual authority, and function as a vital part of a living, growing community.\n\nThis class is your gateway into a life of purposeful belonging - where you are not just a member by name, but a pillar by commitment, a vessel by consecration, and a blessing by presence.\n\nWho this is for: New members, prospective members, and anyone seeking to deepen their understanding of what it means to be truly planted in God\'s house.',
                'course_type': 'membership_class',
                'duration_weeks': 4,
                'total_videos': 12,
                'is_free': True,
                'price': 0.0,
                'thumbnail_url': '/images/courses/membership-class.jpg',
                'is_published': True
            },
            {
                'title': 'Workers Class',
                'description': 'Equipped for Service - Becoming an Effective Worker in God\'s Kingdom\n\nThe Workers Class is a transformational training programme designed to raise a generation of church workers who do not merely serve out of routine, but out of revelation - men and women who understand that service in God\'s house is one of the highest callings on a believer\'s life.\n\nEvery believer carries God-given gifts, talents, skills, and resources that the Kingdom is waiting to deploy. This course is the bridge between potential and impact. Participants will be trained in the theology of service, the character required of a Kingdom worker, the principles of excellence, accountability, and teamwork, and how to effectively use their unique gifts in alignment with the vision and mission of the house.\n\nWhether you serve behind the scenes or on the frontline, this class will equip you to work with precision, passion, and the power of the Holy Spirit. You will leave not just knowing what to do - but understanding why you do it, and being empowered to do it with excellence that glorifies God.\n\nWho this is for: Active workers, volunteers, department leads, and anyone transitioning from membership into active service in God\'s house.',
                'course_type': 'workers_class',
                'duration_weeks': 6,
                'total_videos': 18,
                'is_free': True,
                'price': 0.0,
                'thumbnail_url': '/images/courses/workers-class.jpg',
                'is_published': True
            },
            {
                'title': 'Departmental Training',
                'description': 'Department-Specific Equipping - Excellence in Every Role, Glory in Every Function\n\nThe Departmental Training is a specialised, role-specific equipping programme designed to train, transform, and sharpen church workers with the prerequisite knowledge, skills, and spiritual disposition required for effective, high-impact service in God\'s house.\n\nEvery department in the church is a strategic arm of Kingdom advancement - and excellence in each department reflects the nature of the God we serve. This programme ensures that no worker steps into their post unprepared. Each departmental track is carefully curated to address the unique demands, standards, and spiritual dimensions of service within that area.\n\nAvailable training tracks include:\n\n1. Media Training - Visual storytelling, broadcast production, live streaming, social media ministry, and the theology of Kingdom media.\n2. Choir Training - Vocal development, musical theory, worship leading, choir coordination, and the spirit of a worshipper.\n3. Protocol, Ushering & Security Training - Order in the house of God, hospitality, crowd management, conflict de-escalation, and maintaining a safe, dignified sanctuary.\n4. Children\'s Teacher Training - Child development principles, creative Bible teaching, classroom management, safeguarding, and raising champions from childhood.\n5. Facility Management Training - Stewardship of God\'s property, maintenance culture, space planning, safety compliance, and the theology of caring for God\'s house.\n\nParticipants who complete their departmental track will be equipped not just with technical know-how, but with a servant\'s heart, a spirit of excellence, and an unshakeable commitment to the advancement of God\'s Kingdom through their God-given role.\n\nWho this is for: All active workers and department members seeking to grow in skill, character, and effectiveness within their specific area of service.',
                'course_type': 'departmental_training',
                'duration_weeks': 8,
                'total_videos': 24,
                'is_free': False,
                'price': 49.99,
                'thumbnail_url': '/images/courses/departmental-training.jpg',
                'is_published': True
            },
            {
                'title': 'Pavilion School of Ministry',
                'description': 'Called, Trained, and Sent - Theological Equipping for Those Called to Ministry\n\nThe Pavilion School of Ministry is a rigorous, Spirit-led theological training institute designed to equip the saints of God for the work of the ministry - raising a generation of consecrated, theologically sound, and practically equipped ministers who will carry the full weight of the fivefold ministry into the nations of the earth.\n\nThis is not merely an academic programme. It is a furnace of transformation - where those called of God as Pastors, Apostles, Bishops, Deacons, Deaconesses, Teachers, and Prophets are shaped in the fires of sound doctrine, spiritual discipline, and Kingdom character. Every module is designed to align participants with the Word of God, the Holy Spirit, and the demands of authentic, Christ-centred ministry.\n\nParticipants will engage deeply with systematic theology, biblical hermeneutics and exegesis, homiletics and preaching, pastoral care and counselling, apostolic and prophetic ministry, church administration and leadership, and the ethical and spiritual demands of ministerial life.\n\nThe Pavilion School of Ministry does not just produce people who know the Bible - it produces people who have been encountered by the God of the Bible, and who carry His authority, His compassion, and His fire wherever they go.\n\nWho this is for: Individuals with a clear calling to ministry office - pastors, teachers, prophets, evangelists, apostles, deacons, and deaconesses - who desire to be properly trained, accountable, and credentialed for life-long Kingdom service.',
                'course_type': 'school_of_ministry',
                'duration_weeks': 12,
                'total_videos': 36,
                'is_free': False,
                'price': 199.99,
                'thumbnail_url': '/images/courses/pavilion-ministry.jpg',
                'is_published': True
            },
            {
                'title': 'HILA - High Impact Leadership Academy',
                'description': 'HILA (High Impact Leadership Academy) is a kingdom-driven leadership development program designed to raise high-impact leaders who excel in both spiritual alignment and practical influence.\n\nFounded under the visionary leadership of Dr John Okopi, Global Lead Pastor of Life Builders City Church, the academy equips individuals with the mindset, discipline, and strategic capacity required to lead with excellence in business, ministry, and life.\n\nHILA integrates sound leadership principles with kingdom values - empowering participants to drive results, influence systems, and create lasting impact while remaining rooted in purpose, integrity, and divine direction.\n\nThe academy operates on three core pillars: Mindset - cultivating a kingdom-aligned thought architecture; Discipline - forging the habits, structure, and consistency that separate ordinary leaders from extraordinary ones; and Strategy - developing the capacity to think systemically, plan effectively, and execute with both spiritual wisdom and practical intelligence.\n\nHILA is not just a leadership course. It is a commissioning ground - where destiny is clarified, character is tested, and capacity is expanded. Graduates leave not merely as better leaders, but as Kingdom forces - men and women who understand that true greatness is measured not by title or position, but by the depth of the impact they leave on the people and systems they touch.\n\nWho this is for: Entrepreneurs, executives, ministry leaders, young professionals, and anyone with a conviction that they were created to lead at the highest level - in business, in the church, and in life.',
                'course_type': 'hila',
                'duration_weeks': 16,
                'total_videos': 48,
                'is_free': False,
                'price': 299.99,
                'thumbnail_url': '/images/courses/hila-academy.jpg',
                'is_published': True
            },
            {
                'title': 'Marriage (Godly Family)',
                'description': 'Biblical wisdom for building strong marriages and families in today\'s world. This course provides practical guidance based on biblical principles for couples and families seeking to honor God through their relationships.',
                'course_type': 'discipleship',
                'duration_weeks': 4,
                'total_videos': 12,
                'is_free': False,
                'price': 39.99,
                'thumbnail_url': '/images/courses/marriage-family.jpg',
                'is_published': True
            }
        ]
        
        # Create all 6 courses
        for course_data in exact_courses:
            course = Course(
                instructor_id=admin_user.id if admin_user else 1,
                **course_data
            )
            db.add(course)
            print(f"Created course: {course.title}")
        
        db.commit()
        print("SUCCESS: Created exactly 6 courses as specified!")
        print(f"Total courses: {len(exact_courses)}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_courses_exact()
