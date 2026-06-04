import { faChurch, faUsers, faPersonPraying } from "@fortawesome/free-solid-svg-icons";

import CHURCH_1 from '../assets/images/Church-1.jpeg';
import CHURCH_2 from '../assets/images/Church-2.jpg';
import YT_THUMB from '../assets/images/YouTube-Thumbnail.png';

export const NAV_LINKS = [
  { label: 'Home',     href: '#hero' },
  { label: 'About',    href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Sermons',  href: '#sermons' },
  { label: 'Events',   href: '#events' },
  { label: 'Gallery',  href: '#gallery' },
  { label: 'Contact',  href: '#contact' },
];

export const TICKER_ITEMS = [
  'Sunday Service',
  'Sunday School',
  'Wednesday Service',
  'Intercession',
  'Cell Groups',
  'Youth Ministry',
  'Mothers Ministry',
  'Couples Ministry',
  'Community Outreach',
  'Evangelism'
];

export const VALUES = [
  {
    icon: faChurch,
    title: 'Faith',
    desc: 'Grounded in the Gospel of Jesus Christ, we live by His Word and confess Him as Lord and Savior of all.',
  },
  {
    icon: faUsers,
    title: 'Unity',
    desc: 'We embrace believers from all nations, building one spiritual family under Christ in love and harmony.',
  },
  {
    icon: faPersonPraying,
    title: 'Transformation',
    desc: 'Committed to spiritual growth and renewal through worship, teaching, and the power of the Holy Spirit.',
  },
];

// ── Gallery: real images. Add your own here ──────────────
// export const GALLERY_ITEMS = [
//   { id: 'g1', label: 'Sunday Worship',    src: CHURCH_1, alt: 'Congregation gathered for Sunday worship at ICP', span: true },
//   { id: 'g2', label: 'Our Sanctuary',     src: CHURCH_2, alt: 'The ICP sanctuary on a Sunday morning' },
//   { id: 'g3', label: 'Community',         src: CHURCH_1, alt: 'ICP members fellowshipping after service' },
//   { id: 'g4', label: 'CBD Outreach',      src: CHURCH_2, alt: 'ICP outreach team serving in Pretoria CBD' },
//   { id: 'g5', label: 'Praise & Worship',  src: CHURCH_1, alt: 'Praise and worship moment during service' },
// ];

// ── Sermons: latest preachings (YouTube) ─────────────────
// export const SERMONS = [
//   {
//     id: 's1',
//     title: 'Faith That Moves Mountains',
//     speaker: 'Pastor Emmanuel Tshilenga Kabala',
//     date: 'May 4, 2025',
//     duration: '42 min',
//     youtubeId: 'dQw4w9WgXcQ', // ← replace with real YouTube ID
//     thumbnail: YT_THUMB,
//   },
//   {
//     id: 's2',
//     title: 'Walking In The Light',
//     speaker: 'Pastor Emmanuel Tshilenga Kabala',
//     date: 'April 27, 2025',
//     duration: '38 min',
//     youtubeId: 'dQw4w9WgXcQ',
//     thumbnail: YT_THUMB,
//   },
//   {
//     id: 's3',
//     title: 'The Power of Prayer',
//     speaker: 'Pastor Emmanuel Tshilenga Kabala',
//     date: 'April 20, 2025',
//     duration: '45 min',
//     youtubeId: 'dQw4w9WgXcQ',
//     thumbnail: YT_THUMB,
//   },
// ];

// ── Upcoming events ──────────────────────────────────────
// export const EVENTS = [
//   {
//     id: 'e1',
//     title: 'Annual Church Conference',
//     date: 'May 24, 2026',
//     day: 'Sun',
//     dateNum: '24',
//     month: 'May',
//     time: '09:00 – 16:00',
//     location: 'ICP Main Sanctuary',
//     desc: 'A day of teaching, worship, and ministry as we gather to seek God\'s direction for the year ahead.',
//     badge: 'Conference',
//   },
//   {
//     id: 'e2',
//     title: 'Youth Worship Night',
//     date: 'June 7, 2026',
//     day: 'Sat',
//     dateNum: '07',
//     month: 'Jun',
//     time: '18:30 – 21:00',
//     location: 'ICP Main Sanctuary',
//     desc: 'An evening of worship and prayer led by our youth ministry. All teens and young adults welcome.',
//     badge: 'Youth',
//   },
//   {
//     id: 'e3',
//     title: 'Community Outreach — CBD',
//     date: 'June 21, 2026',
//     day: 'Sun',
//     dateNum: '21',
//     month: 'Jun',
//     time: '11:00 – 14:00',
//     location: 'Pretoria CBD',
//     desc: 'Join us as we serve meals and share the love of Christ with people in the city center.',
//     badge: 'Outreach',
//   },
// ];

// export const CONTACT_ITEMS = [
//   {
//     icon: '📍',
//     label: 'Location',
//     value: 'Bronwen St, between Madiba St & WF Nkomo\nPretoria Central, 0007',
//   },
//   {
//     icon: '🕐',
//     label: 'Sunday Services',
//     value: 'Intercession: 07:30\nMain Service: 09:00',
//   },
//   {
//     icon: '📅',
//     label: 'Wednesday Service',
//     value: 'Every Wednesday Evening',
//   },
//   {
//     icon: '✉️',
//     label: 'Email',
//     value: 'info@icpretoria.org',
//   },
// ];

// export const FOOTER_COLS = [
//   {
//     title: 'Other Pages',
//     links: [
//       { label: 'Gallery',         href: '#gallery' },
//       { label: 'Contact',         href: '#contact' },
//       { label: 'Sermons',         href: '#sermons' },
//       { label: 'Events',          href: '#events' },
//     ],
//   },
//   {
//     title: 'Church Services',
//     links: [
//       { label: 'Sunday Intercession', href: '#services' },
//       { label: 'Sunday Service',      href: '#services' },
//       { label: 'Sunday School',       href: '#services' },
//       { label: 'Wednesday Service',   href: '#services' },
//     ],
//   },
// ];
