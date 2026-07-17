import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, ArrowRight, Globe } from 'lucide-react';
import { DottedMap } from '../../components/magicui/dotted-map';
import './Contact.css';

const Contact = () => {
    const [selectedLocation, setSelectedLocation] = useState('Delhi');
    const [status, setStatus] = useState('idle');
    const formRef = useRef(null);
    const isInView = useInView(formRef, { once: true, amount: 0.3 });

    const locationDetails = {
        "Delhi": {
            office: "A-58/8, top floor, Vishwakarma colony, MB road ,110044-New Delhi, India",
            phone: "+91 11 41025657",
            email: "mail@gdmspl.com",
            website: "www.gdmspl.com"
        },
        "Mumbai": {
            office: "123, Nariman Point, Mumbai, Maharashtra, India",
            phone: "+91 22 1234 5678",
            email: "mumbai@gdmspl.com",
            website: "www.gdmspl.com"
        },
        "Nepal": {
            office: "Kathmandu Center, Ward No. 3, Kathmandu, Nepal",
            phone: "+977 1 4567890",
            email: "nepal@gdmspl.com",
            website: "www.gdmspl.com"
        },
        "Muscat": {
            office: "Oman Business Park, Muscat, Sultanate of Oman",
            phone: "+968 24 123456",
            email: "muscat@gdmspl.com",
            website: "www.gdmspl.com"
        }
    };

    const markers = [
        { lat: 28.6139, lng: 77.2090, size: 0.3, pulse: true, name: "Delhi", offsetX: -20, offsetY: -8, w: 14 },
        { lat: 19.0760, lng: 72.8777, size: 0.3, pulse: true, name: "Mumbai", offsetX: -7, offsetY: 8, w: 14 },
        { lat: 27.7172, lng: 85.3240, size: 0.3, pulse: true, name: "Nepal", offsetX: 4, offsetY: -8, w: 14 },
        { lat: 23.5859, lng: 58.4059, size: 0.3, pulse: true, name: "Muscat", offsetX: -20, offsetY: -2, w: 14 },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const currentDetails = locationDetails[selectedLocation];

    return (
        <section id="contact" className="contact-section">
            <div className="contact-background">
                <div className="abstract-shape shape-1"></div>
                <div className="abstract-shape shape-2"></div>
                <div className="grid-overlay"></div>
            </div>

            <div className="container">
                <motion.div 
                    className="contact-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {/* Left Side: Globe & Info */}
                    <div className="contact-info-container">
                        <motion.div variants={itemVariants} className="contact-header">
                            <h2 className="section-title">Let's Build <span>Something Extraordinary</span></h2>
                            <p className="section-subtitle">
                                Whether you're planning a residential masterpiece or a commercial landmark, our team is ready to bring your vision to life.
                            </p>
                        </motion.div>

                        <div className="dotted-map-wrapper">
                            <DottedMap 
                                markers={markers} 
                                pulse={true} 
                                className="magic-dotted-map"
                                dotColor="#0a0a0a"
                                markerColor="#ff6b35"
                                renderMarkerOverlay={({ marker, x, y }) => {
                                    const rx = x + (marker.offsetX || 3);
                                    const ry = y + (marker.offsetY || -4);
                                    const w = marker.w || 14;
                                    const isActive = selectedLocation === marker.name;
                                    return (
                                        <g 
                                            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                            onClick={() => setSelectedLocation(marker.name)}
                                        >
                                            <rect 
                                                x={rx} y={ry} width={w} height="5" rx="2.5" 
                                                fill={isActive ? "#ff6b35" : "rgba(255, 255, 255, 0.9)"} 
                                                stroke="#ff6b35" strokeWidth="0.3" opacity="0.95" 
                                            />
                                            <text 
                                                x={rx + w/2} y={ry + 2.8} 
                                                fill={isActive ? "#fff" : "#111"} 
                                                fontSize="2.5" textAnchor="middle" dominantBaseline="middle" fontWeight="600" 
                                                style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.02em' }}
                                            >
                                                {marker.name}
                                            </text>
                                        </g>
                                    );
                                }}
                            />
                        </div>

                        <div className="contact-details">
                            <div className="detail-item">
                                <div className="icon-box"><MapPin size={20} /></div>
                                <div>
                                    <h3>{selectedLocation} Office</h3>
                                    <p>{currentDetails.office}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="icon-box"><Phone size={20} /></div>
                                <div>
                                    <h3>Call Us</h3>
                                    <p>{currentDetails.phone}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="icon-box"><Mail size={20} /></div>
                                <div>
                                    <h3>Email Us</h3>
                                    <p>{currentDetails.email}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="icon-box"><Globe size={20} /></div>
                                <div>
                                    <h3>Website</h3>
                                    <p>{currentDetails.website}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Contact Form */}
                    <motion.div 
                        variants={itemVariants}
                        className="contact-form-container glass"
                        ref={formRef}
                    >
                        <div className="form-header">
                            <MessageSquare className="header-icon" />
                            <h3>Send a Messages</h3>
                            <p>We'll get back to you within 24 hours.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="premium-form">
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <input type="text" id="name" placeholder=" " required />
                                    <label htmlFor="name">Full Name</label>
                                    <div className="input-focus-bg"></div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <input type="email" id="email" placeholder=" " required />
                                    <label htmlFor="email">Email Address</label>
                                    <div className="input-focus-bg"></div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <select id="interest" required defaultValue="">
                                        <option value="" disabled hidden></option>
                                        <option value="residential">Residential Architecture</option>
                                        <option value="commercial">Commercial Projects</option>
                                        <option value="interior">Interior Design</option>
                                        <option value="consultation">Strategic Consultation</option>
                                    </select>
                                    <label htmlFor="interest">Interested in...</label>
                                    <div className="input-focus-bg"></div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <textarea id="message" rows="5" placeholder=" " required></textarea>
                                    <label htmlFor="message">Your Message</label>
                                    <div className="input-focus-bg"></div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className={`submit-btn ${status}`}
                                disabled={status === 'submitting'}
                            >
                                <span className="btn-text">
                                    {status === 'idle' && 'Send Message'}
                                    {status === 'submitting' && 'Sending...'}
                                    {status === 'success' && 'Message Sent!'}
                                </span>
                                <ArrowRight className="btn-icon" />
                                <div className="btn-progress"></div>
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
