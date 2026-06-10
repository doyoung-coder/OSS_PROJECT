import React from 'react';

const ExchangePage = ({ t, currentUser, userPoints, setUserPoints, userNationality, onBack }) => {
  // [환전 데이터 설정]
  const exchangeRates = {
    'South Korea': { symbol: '₩', unit: '원', rate: 1 },
    'Japan': { symbol: '¥', unit: '엔', rate: 0.11 },
    'USA': { symbol: '$', unit: '달러', rate: 0.00075 },
    'Vietnam': { symbol: '₫', unit: '동', rate: 19.05 },
    'Taiwan': { symbol: 'NT$', unit: '타이완 달러', rate: 0.024 },
    'UK': { symbol: '£', unit: '파운드', rate: 0.0006 }
  };

  const currentExchange = exchangeRates[userNationality] || exchangeRates['South Korea'];
  const convertedValue = (userPoints * currentExchange.rate).toLocaleString(undefined, {
    minimumFractionDigits: userNationality === 'Japan' || userNationality === 'USA' ? 2 : 0
  });

  // 💡 수정된 환전 신청 로직
  const handleExchange = async () => {

    if (userPoints <= 0) {
      alert("환전할 포인트가 부족합니다.");
      return;
    }

    const confirmMsg = `${userPoints} P -> ${currentExchange.symbol}${convertedValue} ${currentExchange.unit}. 환전하시겠습니까?`;

    if (window.confirm(confirmMsg)) {
      try {
        const response = await fetch('https://eleven-acquaint-strongly.ngrok-free.dev/api/exchange/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // 💡 currentUser.email 대신 currentUser?.email 로 변경하여 에러 방지
            userEmail: currentUser?.email,
            amount: userPoints
          })
        });

        if (response.ok) {
          alert("환전 신청이 완료되었습니다! 관리자 승인을 기다려주세요.");
          // 2. 신청 성공 후 포인트 초기화 및 이동
          setUserPoints(0);
          onBack();
        } else {
          alert("환전 신청에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("환전 신청 오류:", error);
        alert("서버 연결에 실패했습니다.");
      }
    }
  };

  return (
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onBack} style={styles.backBtn}>←</button>
          <h2 style={styles.title}>환전하기</h2>
          <div style={{ width: '24px' }}></div>
        </header>

        <div style={styles.card}>
          <div style={styles.infoRow}>
            <span style={styles.label}>현재 설정된 국적</span>
            <span style={styles.value}>{userNationality}</span>
          </div>

          <div style={styles.mainVisual}>
            <p style={styles.visualLabel}>보유 포인트</p>
            <h1 style={styles.pointValue}>{userPoints.toLocaleString()} <span style={styles.unit}>P</span></h1>
            <div style={styles.arrowIcon}>↓</div>
            <p style={styles.visualLabel}>예상 수령액</p>
            <h1 style={styles.convertedValue}>
              <span style={styles.currencySymbol}>{currentExchange.symbol}</span> {convertedValue}
            </h1>
            <p style={styles.currencyUnit}>{currentExchange.unit}</p>
          </div>
        </div>

        <div style={styles.actionArea}>
          <button
              onClick={handleExchange}
              style={{ ...styles.exchangeBtn, backgroundColor: userPoints > 0 ? '#1a73e8' : '#ccc' }}
              disabled={userPoints <= 0}
          >
            환전 신청하기
          </button>
        </div>
      </div>
  );
};

const styles = {
  container: { backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  backBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
  title: { fontSize: '18px', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid #f1f3f4' },
  label: { color: '#888', fontSize: '14px' },
  value: { fontWeight: 'bold', color: '#333' },
  mainVisual: { textAlign: 'center', padding: '10px 0' },
  visualLabel: { fontSize: '13px', color: '#999', margin: '5px 0' },
  pointValue: { fontSize: '32px', margin: '0 0 15px 0', color: '#333' },
  unit: { fontSize: '18px', color: '#666' },
  arrowIcon: { fontSize: '24px', color: '#1a73e8', margin: '10px 0' },
  convertedValue: { fontSize: '40px', color: '#1a73e8', margin: '0' },
  currencySymbol: { fontSize: '24px', verticalAlign: 'middle' },
  currencyUnit: { fontSize: '14px', color: '#1a73e8', fontWeight: 'bold', marginTop: '5px' },
  actionArea: { marginTop: '40px', textAlign: 'center' },
  exchangeBtn: { width: '100%', padding: '18px', borderRadius: '15px', border: 'none', color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(26, 115, 232, 0.3)' }
};

export default ExchangePage;