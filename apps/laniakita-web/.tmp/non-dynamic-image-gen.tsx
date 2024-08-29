interface ImgGen {
  base64: string;
  width: number;
  height: number;
}

export default function ImageGenAlt({ bgStr, logoStr, title }: { bgStr: ImgGen; logoStr: ImgGen; title: string }) {
  return title.toLowerCase() === 'home' ? (
    <div
      style={{
        backgroundImage: `url(${bgStr.base64})`,
        backgroundPosition: '0% 0%',
        backgroundSize: `${bgStr.width}px ${bgStr.height}px cover`,
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: 'InterTight',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '-1rem',
        }}
      >
        {/* eslint-disable-next-line -- Image component can't be used here. */}
        <img src={logoStr.base64} height={logoStr.height * 0.45} width={logoStr.width * 0.45} />
        <h3
          style={{
            fontFamily: 'InterTight',
            fontWeight: 900,
            color: '#cdd6f4',
            fontSize: 51,
          }}
        >
          laniakita.com
        </h3>
      </div>
    </div>
  ) : (
    <div
      style={{
        backgroundImage: `url(${bgStr.base64})`,
        backgroundPosition: '0% 0%',
        backgroundSize: `${bgStr.width}px ${bgStr.height}px cover`,
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: 'InterTight',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2.25rem',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '1rem',
        }}
      >
        {/* eslint-disable-next-line -- Image component can't be used here. */}
        <img src={logoStr.base64} height={logoStr.height * 0.12} width={logoStr.width * 0.12} />
        <h3
          style={{
            fontFamily: 'InterTight',
            fontWeight: 400,
            color: '#cdd6f4',
            fontSize: 30,
            display: 'flex',
            flexDirection: 'row',
            gap: '0.5rem',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 600 }}>laniakita.com</span>
        </h3>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#cdd6f4',
          padding: '2.25rem 4rem',
          backgroundColor: '#07070D',
          border: '0.15rem solid #1e1e2e',
          borderRadius: '0.375rem',
        }}
      >
        <h1 style={{ fontWeight: 900, fontSize: 70 }}>{title}</h1>
      </div>
    </div>
  );
}
