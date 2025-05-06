import * as React from "react"
import { HeadFC, PageProps } from "gatsby"
import { motion } from 'framer-motion';


const IndexPage: React.FC<PageProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
      style={{ width: '100%' }}
    >
      HOME
    </motion.div>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>note</title>