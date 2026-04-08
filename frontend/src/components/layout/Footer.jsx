import { Link } from 'react-router-dom'
import { HiLocationMarker, HiPhone, HiMail, HiCalendar } from 'react-icons/hi'
import { FaTelegram, FaFacebook, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  const contactInfo = {
    telegram: 'https://t.me/glorylifechurch',
    email: 'kingdomportecentre@gmail.com',
    phone: '+234 704 241 7497',
    address: 'Korinjoh House, No. 5 Yakubu Gowon Way, Beside Cold Stone (Dominos Pizza), British America, Jos',
    slogan: 'we are taking over!',
    facebook: 'https://facebook.com/kingdomportecentre',
    youtube: 'https://www.youtube.com/@glory-life-church'
  }

  const quickLinks = [
    { name: 'About Us', to: '/about' },
    { name: 'Sermons', to: '/sermons' },
    { name: 'Events', to: '/events' },
    { name: 'Courses', to: '/courses' },
    { name: 'Book Appointment', to: '/appointments' },
    { name: 'Give', to: '/give' },
  ]

  const serviceTimes = [
    { day: 'Sunday Celebration Service', start: '8:30 AM', close: '11:30 AM' },
    { day: 'Wednesday Mid-week Service', start: '5:00 PM', close: '6:30 PM' },
    { day: 'Friday Prayer Stretch', start: '8:00 PM', close: '' },
  ]

  return (
    <footer className="bg-church-purple border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-church-gold to-church-gold-light flex items-center justify-center">
                <span className="text-church-dark font-bold text-xl">LBC</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Life Builder City Church</h3>
                <p className="text-church-gold text-sm font-accent tracking-wider">Building Lives • Building Destiny</p>
              </div>
            </div>
            
            <p className="text-white/60 mb-6 max-w-md">
              A vibrant community of believers committed to building lives and transforming destinies through the power of the Gospel.
            </p>

            {/* Mini Map */}
            <div className="mb-6 rounded-lg overflow-hidden bg-church-purple/30 h-32 flex items-center justify-center border border-church-gold/20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-church-purple/50 to-church-dark/30"></div>
              <div className="relative text-center p-2 z-10">
                <HiLocationMarker className="text-3xl text-church-gold mx-auto mb-2 drop-shadow-lg" />
                <p className="text-white/80 text-xs font-medium">Korinjoh House, Yakubu Gowon Way</p>
                <p className="text-church-gold text-xs font-bold">Jos, Nigeria</p>
              </div>
            </div>

            {/* Slogan */}
            <div className="glass-card-gold px-4 py-2 inline-block">
              <p className="text-church-gold font-bold text-sm uppercase tracking-wider">
                {contactInfo.slogan}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href={contactInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-church-gold hover:border-church-gold/30 transition-all"
              >
                <FaFacebook className="text-sm" />
              </a>
              <a
                href={contactInfo.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-church-gold hover:border-church-gold/30 transition-all"
              >
                <FaYoutube className="text-sm" />
              </a>
              <a
                href={contactInfo.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-church-gold hover:border-church-gold/30 transition-all"
              >
                <FaTelegram className="text-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-accent text-church-gold text-xs tracking-widest uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-white/50 hover:text-church-gold text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-accent text-church-gold text-xs tracking-widest uppercase mb-5">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <HiLocationMarker className="w-4 h-4 text-church-gold mt-0.5 shrink-0" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <HiPhone className="w-4 h-4 text-church-gold shrink-0" />
                <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:text-church-gold transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <HiMail className="w-4 h-4 text-church-gold shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-church-gold transition-colors">
                  {contactInfo.email}
                </a>
              </li>
            </ul>

            {/* Service Times */}
            <div className="mt-6">
              <h4 className="font-accent text-church-gold text-xs tracking-widest uppercase mb-3">Service Times</h4>
              <div className="space-y-2">
                {serviceTimes.map((service, index) => (
                  <div key={index} className="glass-card-gold px-4 py-3 border border-church-gold/20">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-white/80 text-sm">
                      <span className="font-semibold text-church-gold">{service.day}</span>
                      <span className="text-church-gold">|</span>
                      <span>Starts: {service.start}</span>
                      {service.close && (
                        <>
                          <span className="text-church-gold">|</span>
                          <span>Close: {service.close}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} Life Builder City Church. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-white/30 text-sm">
              <Link to="/privacy" className="hover:text-church-gold transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-church-gold transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
