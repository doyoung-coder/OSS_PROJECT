import React, { useState, useEffect } from 'react';
import ReviewDetail from './ReviewDetail';
import ReviewEditor from './ReviewEditor';
import { useLanguage } from './LanguageContext';

const MainPage = ({ currentUser, userPoints, setUserPoints, allReviews, setAllReviews, onProfile, onLogout }) => {
  const { language, t } = useLanguage();

  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [notices, setNotices] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');
  const [myExchanges, setMyExchanges] = useState([]);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const reviewsPerPage = 5;

  const userNickname = currentUser?.nickname || currentUser?.name || t.anonymous;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert(t.logoutAlert);
    onLogout();
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://eleven-acquaint-strongly.ngrok-free.dev/api/reviews/list', {
          headers: {
            'ngrok-skip-browser-warning': '69420' // 리뷰 목록 우회 헤더 추가
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAllReviews(data);
        }
      } catch (error) { console.error("리뷰 목록 실패:", error); }
    };

    const fetchNotices = async () => {
      try {
        const response = await fetch('https://eleven-acquaint-strongly.ngrok-free.dev/api/notices', {
          headers: {
            'ngrok-skip-browser-warning': '69420' // 공지사항 우회 헤더 추가
          }
        });
        if (response.ok) {
          const data = await response.json();
          setNotices(data);
        }
      } catch (error) { console.error("공지사항 서버 연결 실패:", error); }
    };

    fetchReviews();
    fetchNotices();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      // 포인트 환전 내역 우회 헤더 추가 (매우 중요!)
      fetch(`https://eleven-acquaint-strongly.ngrok-free.dev/api/exchange/my?email=${currentUser.email}`, {
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      })
          .then(res => {
            if (!res.ok) throw new Error("서버 응답 상태가 좋지 않습니다.");
            return res.json();
          })
          .then(data => setMyExchanges(Array.isArray(data) ? data : []))
          .catch(err => setMyExchanges([]));
    }
  }, [currentUser]);

  useEffect(() => {
    setCurrentReviewPage(1);
  }, [appliedFilter]);

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const reviewCounts = {};
  (allReviews || []).forEach(rev => {
    if (rev.placeName) {
      reviewCounts[rev.placeName] = (reviewCounts[rev.placeName] || 0) + 1;
    }
  });

  const filteredReviews = (allReviews || [])
      .filter((review) => {
        if (!appliedFilter) return true;
        return review.placeName?.toLowerCase().includes(appliedFilter.toLowerCase());
      })
      .reverse();

  const indexOfLastReview = currentReviewPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  return (
      <div style={styles.container}>
        <div style={styles.noticeBar}>
          {notices.length > 0 ? notices.map(n => <p key={n.id} style={{margin: '5px 0'}}>📢 {n.content}</p>) : <p style={{margin: '0'}}>{t.noNotice}</p>}
        </div>

        <header style={styles.header}>
          <h1 style={styles.logo}>📍 DEEP LOCAL</h1>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={onProfile} style={styles.profileNavBtn}>👤 {userNickname}</button>
            <button onClick={handleLogout} style={styles.logoutBtn}>{t.logout}</button>
          </div>
        </header>

        <div style={styles.mainWorkspace}>
          <div style={styles.leftDashboard}>
            <div style={styles.stickyPanelCard}>
              <h2 style={styles.dashboardTitle}>{t.searchTitle}</h2>
              <input value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} style={styles.input} />
              <button onClick={() => setAppliedFilter(searchKeyword)} style={styles.searchBtn}>{t.searchBtn}</button>
              <button onClick={() => setIsWriteOpen(true)} style={styles.writeTriggerBtnWide}>{t.writeBtn}</button>
            </div>

            <section style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>{t.myExchange}</h3>

              {(!myExchanges || myExchanges.length === 0) ? (
                  <p style={{ fontSize: '14px', color: '#666' }}>{t.noExchange}</p>
              ) : (
                  (myExchanges || []).map(req => (
                      <div key={req.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0', fontSize: '14px' }}>
                        <p style={{ margin: '0 0 5px 0' }}><strong>{t.amount}</strong> {req.amount} P</p>

                        <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#888' }}>
                          {t.reqDate} {formatDateTime(req.createdAt)}
                        </p>
                        {req.processedAt && (
                            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#888' }}>
                              {req.status === 'APPROVED' ? t.appDate : t.rejDate}
                              {formatDateTime(req.processedAt)}
                            </p>
                        )}

                        <p style={{ margin: 0 }}>
                          <strong>{t.status} </strong>
                          {req.status === 'PENDING' && <span style={{color: '#f39c12', fontWeight: 'bold'}}>{t.pending}</span>}
                          {req.status === 'APPROVED' && <span style={{color: '#28a745', fontWeight: 'bold'}}>{t.approved}</span>}
                          {req.status === 'REJECTED' && <span style={{color: '#dc3545', fontWeight: 'bold'}}>{t.rejected}</span>}
                        </p>
                        {req.status === 'REJECTED' && req.rejectReason && (
                            <p style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px', backgroundColor: '#ffeeba', padding: '5px', borderRadius: '4px' }}>
                              {t.reason} {req.rejectReason}
                            </p>
                        )}
                      </div>
                  ))
              )}
            </section>
          </div>

          <div style={styles.rightFeedArea}>
            {currentReviews.map((rev, index) => {
              const placeReviewCount = reviewCounts[rev.placeName] || 0;
              const isRarePlace = placeReviewCount <= 50;

              return (
                  <div key={rev.id || index} style={styles.feedCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={styles.spotTitle}>⛰️ {rev.placeName}</span>
                      <span style={{ fontSize: '13px', color: '#666', backgroundColor: '#f1f3f4', padding: '4px 8px', borderRadius: '12px' }}>
                      ✍️ {rev.authorNickname || rev.authorEmail || t.anonymous}
                    </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontSize: '13px' }}>
                    <span style={{ color: '#555', fontWeight: 'bold' }}>
                      {t.totalReviews} {placeReviewCount}{t.countUnit}
                    </span>
                      {isRarePlace && (
                          <span style={{ color: '#1a73e8', fontWeight: 'bold', backgroundColor: '#e8f0fe', padding: '2px 6px', borderRadius: '4px' }}>
                        {t.rareTags}
                      </span>
                      )}
                    </div>

                    <p style={styles.cardText}>{rev.content}</p>
                    <button onClick={() => setSelectedReview(rev)} style={styles.detailBtn}>{t.detailBtn}</button>
                  </div>
              );
            })}

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '30px', marginBottom: '20px' }}>
                  <button
                      onClick={() => setCurrentReviewPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentReviewPage === 1}
                      style={{ ...styles.pageBtn, opacity: currentReviewPage === 1 ? 0.4 : 1, cursor: currentReviewPage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    {t.prevBtn}
                  </button>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>
                  {currentReviewPage} <span style={{ color: '#999', fontWeight: 'normal' }}>/ {totalPages}</span>
                </span>
                  <button
                      onClick={() => setCurrentReviewPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentReviewPage === totalPages}
                      style={{ ...styles.pageBtn, opacity: currentReviewPage === totalPages ? 0.4 : 1, cursor: currentReviewPage === totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    {t.nextBtn}
                  </button>
                </div>
            )}
          </div>
        </div>

        {isWriteOpen && (
            <ReviewEditor
                currentUser={currentUser}
                language={language}
                onSave={() => setIsWriteOpen(false)}
                onCancel={() => setIsWriteOpen(false)}
            />
        )}

        {selectedReview && (
            <ReviewDetail
                review={selectedReview}
                currentUser={currentUser}
                language={language}
                onClose={() => setSelectedReview(null)}
            />
        )}
      </div>
  );
};

const styles = {
  container: { padding: '24px 40px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f8f9fa', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  logo: { fontSize: '24px', fontWeight: 'bold', color: '#1a73e8' },
  noticeBar: { backgroundColor: '#fff3cd', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', border: '1px solid #ffeeba' },
  profileNavBtn: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer' },
  logoutBtn: { padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: '#ff4757', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  mainWorkspace: { display: 'flex', gap: '20px' },
  leftDashboard: { flex: '1' },
  rightFeedArea: { flex: '2' },
  stickyPanelCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' },
  searchBtn: { width: '100%', padding: '10px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  writeTriggerBtnWide: { width: '100%', padding: '12px', marginTop: '10px', backgroundColor: '#34a853', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  feedCard: { padding: '16px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fff', marginBottom: '10px' },
  detailBtn: { marginTop: '10px', padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  dashboardTitle: { marginTop: 0, fontSize: '18px' },
  spotTitle: { fontWeight: 'bold', fontSize: '16px' },
  cardText: { fontSize: '14px', lineHeight: '1.5' },
  pageBtn: { padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '20px', fontWeight: 'bold', color: '#333', transition: '0.2s' }
};

export default MainPage;