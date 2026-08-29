import { useCare } from '../providers/CareProvider';

export default function CheckInOverlay() {
  const { state } = useCare();

  if (!state.matches('checkingIn')) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(16, 24, 40, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          color: '#111827',
          borderRadius: '20px',
          padding: '1.5rem 2rem',
          textAlign: 'center',
          fontSize: '1.1rem',
          fontWeight: 600,
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.18)',
          maxWidth: '420px',
          width: '100%',
        }}
      >
        Just checking in... Listening for your answer.
      </div>
    </div>
  );
}
