import {
  LuAirplay,
  LuBrush,
  LuClock10,
  LuPanelRight,
  LuStar,
} from 'react-icons/lu'
import type { CourseType, TestimonialSlideType } from './types'

import ebook2 from '@/images/landing/ebook/img-2.jpg'
import ebook3 from '@/images/landing/ebook/img-3.jpg'
import ebook4 from '@/images/landing/ebook/img-4.jpg'

import avatar1 from '@/images/avatars/img-1.jpg'
import avatar2 from '@/images/avatars/img-2.jpg'

const allCourse: CourseType[] = [
  {
    courseName: 'Digital Marketing Course',
    name: 'Jane willow',
    date: 'June 13,2018',
    image: ebook2,
    icons: [LuClock10, LuStar, LuAirplay],
  },
  {
    courseName: 'Graphic Design Course',
    name: 'Stiven oswald',
    date: 'June 17,2018',
    image: ebook3,
    icons: [LuBrush, LuStar, LuPanelRight],
  },
  {
    courseName: 'Financial Analyst Course',
    name: 'Andrew clarkson',
    date: 'June 24,2018',
    image: ebook4,
    icons: [LuClock10, LuStar, LuAirplay],
  },
]

const testimonialSlides: TestimonialSlideType[] = [
  {
    name: 'Adam Peterson',
    position: 'Marketing Consultant',
    description:
      'This template is exquisitely designed and offers fantastic new features. It receives regular updates, ensuring top-notch quality. The support team is unparalleled, providing prompt, courteous, premium, and exceptionally helpful assistance!',
    image: avatar1,
  },
  {
    name: 'Jordan Harvey',
    position: 'SEO/SMO Expert',
    description:
      "Optimization and structure are excellent for SEO fundamentals. An impressive model, everything has been meticulously crafted, from the design to the various adaptations. A beautiful template with clean code that's easy to customize.",
    image: avatar2,
  },
]

export { allCourse, testimonialSlides }
