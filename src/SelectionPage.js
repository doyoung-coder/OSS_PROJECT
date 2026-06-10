import React from 'react';

const SelectionPage = ({ onSelect }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>환영합니다!</h2>
      <p style={styles.desc}>서비스 이용을 위해 원하시는 방식을 선택해주세요.</p>

      <div style={styles.buttonGroup}>
        <button style={{...styles.btn, backgroundColor: '#1a73e8'}} onClick={() => onSelect('login')}>
          로그인 후 시작하기
        </button>
        <button style={{...styles.btn, backgroundColor: '#34a853'}} onClick={() => onSelect('register')}>
          새로운 계정 만들기
        </button>
        <button style={{...styles.btn, backgroundColor: '#70757a'}} onClick={() => onSelect('guest')}>
          로그인 없이 구경하기
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', padding: '100px 20px' },
  title: { fontSize: '32px', marginBottom: '10px' },
  desc: { color: '#666', marginBottom: '40px' },
  buttonGroup: { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' },
  btn: { padding: '15px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
};

export default SelectionPage;