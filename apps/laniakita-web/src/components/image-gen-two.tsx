export default function ImageGenTwo({
  logo,
  logoFormat,
  bg,
  bgFormat,
  title,
  dynamic,
  prefix,
  twitter,
}: {
  logo: ArrayBuffer;
  logoFormat?: string;
  bg: ArrayBuffer;
  bgFormat?: string;
  title: string | undefined;
  dynamic?: boolean;
  prefix?: string;
  twitter?: boolean;
}) {
  const bgBase = Buffer.from(bg).toString('base64');
  const logoBase = Buffer.from(logo).toString('base64');
  const bgData = `data:image/${bgFormat ? bgFormat : 'png'};base64,${bgBase}`;
  const logoData = `data:image/${logoFormat ? logoFormat : 'png'};base64,${logoBase}`;
  if (title?.toLowerCase() === 'home') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'InterTight',
          backgroundColor: 'black',
        }}
      >
        {/* eslint-disable-next-line -- Image component can't be used here. */}
        <img
          src={bgData}
          style={{
            opacity: 0.8,
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            objectFit: 'cover',
          }}
        />

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
          <img src={logoData} alt='Logo for lanaiakita.com' style={{ height: '50%' }} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: 'InterTight',
        backgroundColor: 'black',
      }}
    >
      {/* eslint-disable-next-line -- Image component can't be used here. */}
      <img
        src={bgData}
        style={{
          opacity: 0.8,
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          objectFit: 'cover',
        }}
      />

      {/* eslint-disable-next-line -- Image component can't be used here. */}
      <img src={logoData} height={`20%`} style={{ position: 'absolute', right: 30, top: 30 }} />

      {dynamic ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '-0.75rem',
            alignItems: 'flex-start',
            justifyContent: 'center',
            color: '#cdd6f4',
            padding: '1.25rem 3rem',
            backgroundColor: '#07070D',
            border: '0.15rem solid #1e1e2e',
            borderRadius: '0.375rem',
            maxWidth: '80%',
          }}
        >
          <h2
            style={{
              fontWeight: 600,
              fontSize: twitter ? 50 : 40,
            }}
          >
            {prefix}
          </h2>
          <div style={{ width: '100%', height: '0.15rem', backgroundColor: '#1e1e2e', borderRadius: '0.375rem' }} />
          <h1 style={{ fontWeight: 900, fontSize: twitter ? 80 : 60, textWrap: 'balance' }}>{title}</h1>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cdd6f4',
            padding: '1.25rem 3rem',
            backgroundColor: '#07070D',
            border: '0.15rem solid #1e1e2e',
            borderRadius: '0.375rem',
            maxWidth: '80%',
          }}
        >
          <h1 style={{ fontWeight: 900, fontSize: twitter ? 80 : 60 }}>{title}</h1>
        </div>
      )}
    </div>
  );
}
