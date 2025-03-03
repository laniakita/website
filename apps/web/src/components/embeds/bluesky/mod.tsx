'use client';

import { useEffect, useState } from 'react';

export const BlueskyEmbedCore = () => {
  const [data, setData] = useState<{ msg: string }>({ msg: '' });
  useEffect(() => {
    setData({ msg: 'hi' });
  }, []);

  return <p>{data.msg}</p>;
};
