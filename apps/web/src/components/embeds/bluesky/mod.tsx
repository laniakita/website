'use client'

import { useEffect, useState } from 'react';

const BlueskyEmbed = () => {
  const [data, setData] = useState<{ msg: string }>({ msg: '' });
  useEffect(() => {
    setData({ msg: 'hi' });
  }, []);

  return <p>{data.msg}</p>;
};

export default BlueskyEmbed
