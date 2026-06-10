import React from 'react';

const LandingPage = ({ t, onStart }) => {
  return (
    <div style={styles.container}>
      {/*
        중복되던 상단 언어 선택 바(nav) 섹션을 삭제했습니다.
        이제 App.js의 전역 언어 바만 표시됩니다.
      */}

      {/* 메인 콘텐츠 영역 */}
      <main style={styles.main}>
        <div style={styles.logoBadge}>DEEP LOCAL</div>
        <h1 style={styles.title}>
          {t.landingTitle}
        </h1>
        <p style={styles.description}>
          {t.landingSub}
        </p>

        {/* 시작하기 버튼 */}
        <button onClick={onStart} style={styles.startBtn}>
          {t.getStarted}
        </button>
      </main>

      {/* 하단 특징 소개 영역 */}
      <footer style={styles.footer}>
        <div style={styles.featureItem}>
          <span style={styles.icon}>🧭</span>
          <p>{t.feature1}</p>
        </div>
        <div style={styles.featureItem}>
          <span style={styles.icon}>💎</span>
          <p>{t.feature2}</p>
        </div>
        <div style={styles.featureItem}>
          <span style={styles.icon}>🌏</span>
          <p>{t.feature3}</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    fontFamily: 'sans-serif'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 20px'
  },
  logoBadge: {
    backgroundColor: '#e8f0fe',
    color: '#1a73e8',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#333',
    marginBottom: '15px',
    lineHeight: '1.3'
  },
  description: {
    fontSize: '18px',
    color: '#666',
    maxWidth: '500px',
    marginBottom: '40px',
    lineHeight: '1.6'
  },
  startBtn: {
    padding: '18px 60px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '35px',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(26, 115, 232, 0.2)',
    transition: 'transform 0.2s ease'
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '50px',
    padding: '40px 0',
    borderTop: '1px solid #f1f3f4'
  },
  featureItem: { textAlign: 'center' },
  icon: { fontSize: '24px', marginBottom: '8px', display: 'block' },
};

export default LandingPage;