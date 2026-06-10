import React, { useState } from 'react';

const ProfilePage = ({ t, currentUser, userPoints, userNationality, setUserNationality, allReviews, onBack, onExchange, onNavigateAuth }) => {
  const [tempNationality, setTempNationality] = useState(userNationality);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isMyReviewsOpen, setIsMyReviewsOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // 💡 내가 쓴 리뷰만 필터링 (작성자 이메일 일치 확인)
  const myReviews = (allReviews || []).filter(r => r.authorEmail === currentUser?.email);

  const userInfo = {
    name: currentUser?.nickname || currentUser?.name || "Guest",
    email: currentUser?.email || "",
    rank: "희귀 명소 개척자 (Rare Spot Pioneer)",
    totalDiscovery: myReviews.length,
    influence: 88,
    tags: ["#나만알고싶은", "#로컬맛집", "#정적"]
  };

  const nations = [
    { id: 'South Korea', label: '🇰🇷 대한민국 (South Korea)' },
    { id: 'Japan', label: '🇯🇵 일본 (Japan)' },
    { id: 'Taiwan', label: '🇹🇼 대만 (Taiwan)' },
    { id: 'USA', label: '🇺🇸 미국 (USA)' },
    { id: 'Vietnam', label: '🇻🇳 베트남 (Vietnam)' },
    { id: 'China', label: '🇨🇳 중국 (China)' }
  ];

  const handleSave = () => {
    setUserNationality(tempNationality);
    alert(`${tempNationality}로 설정이 저장되었습니다.`);
  };

  const selectedNationLabel = nations.find(n => n.id === tempNationality)?.label || "Select Nationality";

  if (!currentUser) {
    return (
        <div style={styles.container}>
          <header style={styles.header}>
            <button onClick={onBack} style={styles.backBtn}>←</button>
            <h2 style={styles.title}>{t?.myInfo || "내 정보"}</h2>
            <div style={{ width: '24px' }}></div>
          </header>
          <div style={styles.profileBox}>
            <h2 style={styles.boxTitle}>프로필 (Guest)</h2>
            <p style={styles.guestMessage}>
              현재 <strong>비회원 모드</strong>로 둘러보고 계십니다.<br />
              프로필 조회 및 포인트 환전 기능을 이용하시려면 로그인이 필요합니다.
            </p>
            <div style={styles.guestBtnGroup}>
              <button onClick={onBack} style={styles.backButton}>뒤로가기</button>
              <button onClick={onNavigateAuth} style={styles.loginShortcutBtn}>로그인 / 회원가입 하러 가기</button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onBack} style={styles.backBtn}>←</button>
          <h2 style={styles.title}>{t?.myInfo || "내 정보"}</h2>
          <div style={{ width: '24px' }}></div>
        </header>

        {/* 회원 상단 카드 개요 */}
        <section style={styles.profileSummary}>
          <div style={styles.avatar}>🧭</div>
          <div style={styles.infoContent}>
            <h3 style={styles.userName}>
              {userInfo.name}
              <span style={styles.userEmail}>{userInfo.email}</span>
              <span style={styles.rankBadge}>{userInfo.rank}</span>
            </h3>
            <div style={styles.statsRow}>
              <span>발견 제보 <strong>{userInfo.totalDiscovery}</strong>건</span>
              <span style={styles.statDivider}>|</span>
              <span>영향력 <strong>{userInfo.influence}%</strong></span>
            </div>
            <div style={styles.tagContainer}>
              {userInfo.tags.map(tag => (
                  <span key={tag} style={styles.preferenceTag}>{tag}</span>
              ))}
            </div>
          </div>
        </section>

        {/* 💡 내가 쓴 리뷰 보기 섹션 */}
        <section style={styles.reviewSection}>
          <button onClick={() => setIsMyReviewsOpen(!isMyReviewsOpen)} style={styles.reviewToggleBtn}>
            📂 내가 쓴 리뷰 보기 ({myReviews.length}개)
            <span style={{ float: 'right' }}>{isMyReviewsOpen ? '▲' : '▼'}</span>
          </button>

          {isMyReviewsOpen && (
              <div style={styles.myReviewContainer}>
                {myReviews.length === 0 ? (
                    <p style={styles.noReviewText}>아직 작성하신 리뷰가 없습니다.</p>
                ) : (
                    myReviews.map((rev) => (
                        <div key={rev.id} onClick={() => setSelectedReview(rev)} style={styles.reviewCard}>
                          <h4>📍 {rev.placeName}</h4>
                          <p style={styles.reviewContent}>{rev.content}</p>
                          <small style={styles.reviewDate}>날짜: {rev.date}</small>
                        </div>
                    ))
                )}
              </div>
          )}
        </section>

        {/* 국적 설정 섹션 */}
        <h4 style={styles.sectionTitle}>{t?.nationality || "국적 설정"}</h4>
        <div style={styles.selectWrapper}>
          <button style={styles.selectTrigger} onClick={() => setIsListOpen(!isListOpen)}>
            {selectedNationLabel} <span style={{ float: 'right' }}>▼</span>
          </button>
          {isListOpen && (
              <div style={styles.nationListScroll}>
                {nations.map((nation) => (
                    <div key={nation.id} onClick={() => { setTempNationality(nation.id); setIsListOpen(false); }} style={styles.nationItem}>
                      {nation.label}
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* 보유 포인트 카드 */}
        <section style={styles.pointCard}>
          <div style={styles.pointInfo}>
            <p style={styles.pointLabel}>보유 포인트</p>
            <h2 style={styles.pointVal}>{(userPoints || 0).toLocaleString()} P</h2>
          </div>
          <button onClick={onExchange} style={styles.miniExchangeBtn}>환전</button>
        </section>

        <button onClick={handleSave} style={styles.floatingSaveBtn}>저장하기</button>

        {/* 상세 리뷰 모달 */}
        {selectedReview && (
            <div style={styles.detailOverlay}>
              <div style={styles.detailCard}>
                <div style={styles.detailHeader}>
                  <h4>🔍 상세 내용</h4>
                  <button onClick={() => setSelectedReview(null)} style={styles.closeDetailBtn}>×</button>
                </div>
                <p>{selectedReview.content}</p>
              </div>
            </div>
        )}
      </div>
  );
};

const styles = {
  container: { backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px', pb: '80px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  backBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
  title: { fontSize: '18px', fontWeight: '700' },
  profileSummary: { display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  avatar: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e8f0fe', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px' },
  infoContent: { flex: 1 },
  userName: { margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold', display: 'flex', flexDirection: 'column' },
  userEmail: { fontSize: '12px', color: '#888', fontWeight: 'normal' },
  rankBadge: { fontSize: '11px', color: '#1a73e8', marginTop: '6px' },
  statsRow: { fontSize: '13px', color: '#666', marginBottom: '8px' },
  statDivider: { margin: '0 8px', color: '#eee' },
  tagContainer: { display: 'flex', gap: '5px' },
  preferenceTag: { fontSize: '10px', backgroundColor: '#f1f3f4', padding: '2px 6px', borderRadius: '4px', color: '#5f6368' },

  reviewSection: { marginBottom: '25px' },
  reviewToggleBtn: { width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  myReviewContainer: { marginTop: '10px', backgroundColor: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  reviewCard: { borderBottom: '1px solid #eee', padding: '10px 0' },
  reviewContent: { fontSize: '13px', color: '#555', margin: '5px 0' },
  reviewDate: { fontSize: '11px', color: '#aaa' },

  sectionTitle: { fontSize: '14px', color: '#555', marginBottom: '10px', paddingLeft: '4px' },
  selectWrapper: { position: 'relative', marginBottom: '25px' },
  selectTrigger: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: '#fff', textAlign: 'left', cursor: 'pointer' },
  nationListScroll: { position: 'absolute', top: '60px', width: '100%', maxHeight: '150px', overflowY: 'auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100 },
  nationItem: { padding: '12px 20px', cursor: 'pointer', fontSize: '14px' },
  pointCard: { backgroundColor: '#fff', borderRadius: '15px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  pointLabel: { margin: 0, fontSize: '12px', color: '#888' },
  pointVal: { margin: 0, fontSize: '20px', fontWeight: 'bold' },
  miniExchangeBtn: { padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#1a73e8', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  floatingSaveBtn: { position: 'fixed', bottom: '20px', right: '20px', padding: '15px 40px', borderRadius: '30px', border: 'none', backgroundColor: '#34a853', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },

  detailOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  detailCard: { backgroundColor: '#fff', width: '350px', padding: '20px', borderRadius: '16px' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  closeDetailBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }
};

export default ProfilePage;