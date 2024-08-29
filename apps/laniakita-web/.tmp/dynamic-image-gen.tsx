interface ImgGen {
  base64: string;
  width: number;
  height: number;
}

export default function DynamicImageGen({
  bgStr,
  logoStr,
  title,
  prefix,
}: {
  bgStr: ImgGen;
  logoStr: ImgGen;
  title: string;
  prefix: string;
}) {
  return (
    <div
      style={{
        backgroundImage: `url(${bgStr.base64})`,
        backgroundPosition: '0% 0%',
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
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '-2.5rem',
            color: '#cdd6f4',
            padding: '2.5rem 4rem',
            backgroundColor: '#07070D',
            border: '0.15rem solid #1e1e2e',
            borderRadius: '0.375rem',
            maxWidth: '80%',
          }}
        >
          <h2
            style={{
              fontWeight: 600,
              fontSize: 40,
            }}
          >
            {prefix}
          </h2>
          <h1 style={{ fontWeight: 900, fontSize: 50, textWrap: 'balance' }}>{title}</h1>
        </div>
      </div>
    </div>
  );
}
