export const COURSE_TYPES = {
  membership_class: {
    value: 'membership_class',
    label: 'Membership Class',
    title: 'Rooted in House — Becoming an Effective Member of God\'s Church',
    description: 'The Membership Class is a foundational training designed for every believer who desires to move beyond casual church attendance into meaningful, rooted membership in Body of Christ. True membership in God\'s house is not merely having your name on a register — it is understanding your identity, your responsibilities, and your place within covenant community of believers.',
    whoItsFor: 'New members, prospective members, and anyone seeking to deepen their understanding of what it means to be truly planted in God\'s house.',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  },
  
  workers_class: {
    value: 'workers_class',
    label: 'Workers Class',
    title: 'Equipped for Service — Becoming an Effective Worker in God\'s Kingdom',
    description: 'The Workers Class is a transformational training programme designed to raise a generation of church workers who do not merely serve out of routine, but out of revelation — men and women who understand that service in God\'s house is one of the highest callings on a believer\'s life.',
    whoItsFor: 'Active workers, volunteers, department leads, and anyone transitioning from membership into active service in God\'s house.',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  
  departmental_training: {
    value: 'departmental_training',
    label: 'Departmental Training',
    title: 'Department-Specific Equipping — Excellence in Every Role, Glory in Every Function',
    description: 'The Departmental Training is a specialised, role-specific equipping programme designed to train, transform, and sharpen church workers with prerequisite knowledge, skills, and spiritual disposition required for effective, high-impact service in God\'s house.',
    whoItsFor: 'All active workers and department members seeking to grow in skill, character, and effectiveness within their specific area of service.',
    tracks: [
      'Media Training — Visual storytelling, broadcast production, live streaming, social media ministry, and theology of Kingdom media.',
      'Choir Training — Vocal development, musical theory, worship leading, choir coordination, and spirit of a worshipper.',
      'Protocol, Ushering & Security Training — Order in the house of God, hospitality, crowd management, conflict de-escalation, and maintaining a safe, dignified sanctuary.',
      'Children\'s Teacher Training — Child development principles, creative Bible teaching, classroom management, safeguarding, and raising champions from childhood.',
      'Facility Management Training — Stewardship of God\'s property, maintenance culture, space planning, safety compliance, and theology of caring for God\'s house.'
    ],
    color: 'bg-green-500/20 text-green-400 border-green-500/30'
  },
  
  school_of_ministry: {
    value: 'school_of_ministry',
    label: 'Pavilion School of Ministry',
    title: 'Called, Trained, and Sent — Theological Equipping for Those Called to Ministry',
    description: 'The Pavilion School of Ministry is a rigorous, Spirit-led theological training institute designed to equip saints of God for the work of ministry — raising a generation of consecrated, theologically sound, and practically equipped ministers who will carry the full weight of the fivefold ministry into the nations of the earth.',
    whoItsFor: 'Individuals with a clear calling to ministry office — pastors, teachers, prophets, evangelists, apostles, deacons, and deaconesses — who desire to be properly trained, accountable, and credentialed for life-long Kingdom service.',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  },
  
  hila: {
    value: 'hila',
    label: 'HILA — High Impact Leadership Academy',
    title: 'HILA (High Impact Leadership Academy)',
    description: 'HILA (High Impact Leadership Academy) is a kingdom-driven leadership development program designed to raise high-impact leaders who excel in both spiritual alignment and practical influence.',
    whoItsFor: 'Entrepreneurs, executives, ministry leaders, young professionals, and anyone with a conviction that they were created to lead at the highest level — in business, in church, and in life.',
    pillars: [
      'Mindset — cultivating a kingdom-aligned thought architecture',
      'Discipline — forging habits, structure, and consistency that separate ordinary leaders from extraordinary ones',
      'Strategy — developing capacity to think systemically, plan effectively, and execute with both spiritual wisdom and practical intelligence'
    ],
    color: 'bg-red-500/20 text-red-400 border-red-500/30'
  }
}

export const getCourseTypeConfig = (courseType) => {
  return COURSE_TYPES[courseType] || {
    value: courseType,
    label: courseType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    title: 'Course',
    description: 'A course designed for spiritual growth and development.',
    whoItsFor: 'Anyone seeking to grow in their faith and understanding.',
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

export const getCourseTypeOptions = () => {
  return Object.values(COURSE_TYPES).map(type => ({
    value: type.value,
    label: type.label
  }))
}
