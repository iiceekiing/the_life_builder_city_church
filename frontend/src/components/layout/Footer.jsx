import { Link } from 'react-router-dom'
import { HiLocationMarker, HiPhone, HiMail, HiCalendar } from 'react-icons/hi'

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', to: '/about' },
    { name: 'Sermons', to: '/sermons' },
    { name: 'Events', to: '/events' },
    { name: 'Courses', to: '/courses' },
    { name: 'Book Appointment', to: '/appointments' },
    { name: 'Partner With Us', to: '/partner' },
  ]

  const serviceTimes = [
    { day: 'Sunday', time: '8:00 AM & 10:30 AM', type: 'Services' },
    { day: 'Wednesday', time: '6:00 PM', type: 'Bible Study' },
    { day: 'Friday', time: '7:00 PM', type: 'Prayer Meeting' },
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

            {/* Social Links */}
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-church-gold hover:border-church-gold/30 transition-all"
                >
                  <span className="text-xs font-accent">{social[0]}</span>
                </a>
              ))}
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
                <span>Life Builder City Church, 12 Kingdom Avenue, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <HiPhone className="w-4 h-4 text-church-gold shrink-0" />
                <a href="tel:+2348000000000" className="hover:text-church-gold transition-colors">
                  +234 800 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <HiMail className="w-4 h-4 text-church-gold shrink-0" />
                <a href="mailto:info@lifebuildercitychurch.org" className="hover:text-church-gold transition-colors">
                  info@lifebuildercitychurch.org
                </a>
              </li>
            </ul>

            {/* Service Times */}
            <div className="mt-6">
              <h4 className="font-accent text-church-gold text-xs tracking-widest uppercase mb-3">Service Times</h4>
              <div className="space-y-2">
                {serviceTimes.map((service, index) => (
                  <div key={index} className="flex items-center gap-2 text-white/50 text-sm">
                    <HiCalendar className="w-3 h-3 text-church-gold" />
                    <span>{service.day}: {service.time}</span>
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
