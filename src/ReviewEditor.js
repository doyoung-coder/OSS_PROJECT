import React, { useState, useRef, useEffect } from 'react';

const ReviewEditor = ({ currentUser, onSave, onCancel }) => {
  const [reviewData, setReviewData] = useState({
    country: '', region: '', placeName: '', text: '', tags: '',
  });

  const [mapSearchKeyword, setMapSearchKeyword] = useState('');
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const countryData = {
    "South Korea": ["Daegu", "Seoul", "Busan", "Jeju"],
    "Japan": ["Kyoto", "Tokyo", "Osaka"],
    "USA": ["New York", "Los Angeles"],
  };

  // 지도 및 마커 초기화
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      if (window.google && window.google.maps) {
        // 1. 기본 대구 좌표로 지도 렌더링
        mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: 35.8714, lng: 128.6014 },
          zoom: 14,
        });

        // 2. 빨간색 마커 생성
        markerRef.current = new window.google.maps.Marker({
          position: { lat: 35.8714, lng: 128.6014 },
          map: mapRef.current,
          draggable: true, // 마커를 마우스로 끌어서 이동할 수 있게 허용
          animation: window.google.maps.Animation.DROP,
        });

        // 💡 3. 보너스 기능: 마커를 드래그해서 놓으면, 그 위치의 주소로 자동 업데이트!
        markerRef.current.addListener('dragend', () => {
          const newPos = markerRef.current.getPosition();
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: newPos }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setReviewData(prev => ({ ...prev, placeName: results[0].formatted_address }));
              setMapSearchKeyword(results[0].formatted_address); // 검색창 글자도 변경
            }
          });
        });

      } else {
        console.error("Google Maps API가 로드되지 않았습니다.");
      }
    }
  }, []);

  // 🔍 장소 검색 함수
  const handleMapSearch = () => {
    if (!mapSearchKeyword) return;
    if (!window.google) return alert("Google Maps가 아직 로드되지 않았습니다.");

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: mapSearchKeyword }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;

        // 💡 지도 중심을 부드럽게 이동 (panTo)시키고 줌을 당겨줍니다.
        mapRef.current.panTo(location);
        mapRef.current.setZoom(16);

        // 💡 빨간 마커를 검색된 위치로 즉시 이동시킵니다.
        markerRef.current.setPosition(location);
        markerRef.current.setAnimation(window.google.maps.Animation.DROP);

        setReviewData({ ...reviewData, placeName: results[0].formatted_address });
        setMapSearchKeyword(results[0].formatted_address); // 정확한 풀네임 주소로 덮어쓰기
      } else {
        alert("해당 장소를 찾을 수 없습니다. 다시 검색해 주세요.");
      }
    });
  };

  // 💡 엔터키 버그 방지: 검색창에서 엔터를 쳤을 때 폼이 제출되지 않고 '검색'만 되도록 막아줍니다.
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 기본 제출 기능 차단
      handleMapSearch();  // 검색 함수 실행
    }
  };

  // 💾 서버로 전송
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reviewData.placeName) return alert("지도를 검색하여 장소를 지정해주세요.");

    const payload = {
      spotName: reviewData.placeName,
      content: reviewData.text,
      country: reviewData.country,
      region: reviewData.region,
      location: mapSearchKeyword,
      userEmail: currentUser ? currentUser.email : "guest@test.com"
    };

    try {
      const response = await fetch('https://eleven-acquaint-strongly.ngrok-free.dev/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("리뷰가 성공적으로 등록되었습니다!");
        onSave(); // 모달 닫기
      } else {
        alert("서버 연결에 실패했습니다. (상태 코드: " + response.status + ")");
      }
    } catch (error) {
      console.error("통신 에러:", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    }
  };

  return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <h2>📝 숨은 명소 보물 제보</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <select style={styles.select} value={reviewData.country} onChange={e => setReviewData({...reviewData, country: e.target.value})}>
                <option value="">나라 선택</option>
                {Object.keys(countryData).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select style={styles.select} value={reviewData.region} onChange={e => setReviewData({...reviewData, region: e.target.value})}>
                <option value="">지역 선택</option>
                {reviewData.country && countryData[reviewData.country].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div style={styles.searchRow}>
              <input
                  placeholder="장소명 또는 주소 입력 후 검색 (예: 이월드)..."
                  value={mapSearchKeyword}
                  onChange={(e) => setMapSearchKeyword(e.target.value)}
                  onKeyDown={handleKeyDown} // 💡 엔터키 이벤트 연결
                  style={styles.input}
              />
              <button type="button" onClick={handleMapSearch} style={styles.searchBtn}>검색</button>
            </div>

            <div ref={mapContainerRef} style={styles.largeMapBox} />

            <textarea
                style={styles.textarea}
                placeholder="나만이 아는 이곳의 매력을 자유롭게 적어주세요..."
                value={reviewData.text}
                onChange={e => setReviewData({...reviewData, text: e.target.value})}
            />

            <div style={styles.btnGroup}>
              <button type="button" onClick={onCancel} style={styles.cancelBtn}>취소</button>
              <button type="submit" style={styles.submitBtn}>등록하기</button>
            </div>
          </form>
        </div>
      </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', padding: '25px', borderRadius: '15px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  row: { display: 'flex', gap: '10px' },
  searchRow: { display: 'flex', gap: '10px' },
  select: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', flex: 1, fontSize: '15px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', flex: 1, fontSize: '15px' },
  largeMapBox: { height: '300px', width: '100%', borderRadius: '10px', backgroundColor: '#e5e3df', overflow: 'hidden', border: '1px solid #eee' },
  textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', height: '120px', resize: 'vertical', fontSize: '15px' },
  searchBtn: { padding: '10px 20px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  btnGroup: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' },
  cancelBtn: { padding: '12px 24px', background: '#f1f3f4', color: '#5f6368', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  submitBtn: { padding: '12px 24px', background: '#34a853', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default ReviewEditor;