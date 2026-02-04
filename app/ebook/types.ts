import type { StaticImageData } from 'next/image'
import { IconType } from 'react-icons'

export type CourseType = {
  courseName: string
  name: string
  date: string
  image: StaticImageData
  icons: IconType[]
}

export type TestimonialSlideType = {
  name: string
  position: string
  description: string
  image: StaticImageData
}
