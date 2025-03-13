import { motion } from 'motion/react';

export default function ServicesTable({ code }: { code: string }) {
  return (
    <motion.figure
      initial={{ opacity: 0, transform: 'translate3d(0rem, 20%, 0rem)' }}
      whileInView={{
        opacity: 1,
        transform: 'translate3d(0rem, 0%, 0rem)',
        transition: {
          duration: 0.8,
          delay: 0,
          ease: 'backOut',
        },
      }}
      viewport={{ once: true }}
      className={`relative z-10`}
    >
      <div className='prose-protocol-omega' dangerouslySetInnerHTML={{ __html: code }} />
    </motion.figure>
  );
}
