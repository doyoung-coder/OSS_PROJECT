1. 실행 환경
   
Java 설치
Java Development Kit (JDK) 21이 설치되어 있어야 한다.

Gradle 빌드 도구 설치
Gradle이 설치되어 있어야 한다. Gradle 다운로드

설치 방법: 원하는 버전을 다운로드 ➔ 디렉토리(C:\gradle) 생성 ➔ 다운로드한 압축 파일 해제

환경 변수 설정: 시스템 환경 변수 편집 ➔ 환경 변수 ➔ 시스템 변수 ➔ Path 선택 후 편집 ➔ 새로 만들기 클릭 후 bin 디렉토리 경로 입력

예: Gradle을 C:\gradle\gradle-8.14.2-bin\gradle-8.14.2\bin에 설치했다면 해당 경로를 추가

확인: PowerShell을 열고 gradle -v 입력, 정상적으로 설치되면 Gradle 버전 정보가 출력된다.

Node.js 설치 (프론트엔드 구동용)
Node.js (LTS 버전)이 설치되어 있어야 한다.

확인: 터미널에서 node -v 및 npm -v를 입력하여 설치를 확인한다.

ngrok 계정 및 ngrok CLI
로컬 서버의 외부 개방 및 교차 통신을 위해 필요하다. ngrok 공식 홈페이지

기타 필수 도구
Git, IDE (IntelliJ IDEA, VS Code 등)

2. 프로젝트 실행 방법
   
소스코드 .zip 파일을 다운받은 후에 파일 탐색기나 명령어를 통해 압축을 해제한다.

2-1. 백엔드 (Spring Boot) 실행 방법

프로젝트의 application.yml 파일이 빌드된 JAR 파일과 같은 디렉토리에 위치해야 정상 작동한다.

인텔리제이(IntelliJ)에서 백엔드 프로젝트 폴더를 연다.

build.gradle 파일을 열고 아래와 같이 핵심 플러그인과 의존성이 포함되어 있는지 확인한다.

Gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.5' 
    id 'io.spring.dependency-management' version '1.1.6'
}

group = 'com.yeungnam'
version = '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = '21' 
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly 'com.mysql:mysql-connector-j'
    runtimeOnly 'com.h2database:h2'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'

}

tasks.named('test') {
    useJUnitPlatform()
}

터미널(cmd)을 열고 백엔드 프로젝트 루트 디렉토리로 이동한다

.\gradlew clean build 명령어를 입력해 JAR 파일을 생성한다.

빌드가 완료되면 build/libs 디렉토리 안에 deeplocal-0.0.1-SNAPSHOT.jar 파일이 생성된다.

터미널에서 JAR 파일이 있는 디렉토리로 이동한 후, java -jar deeplocal-0.0.1-SNAPSHOT.jar 명령어를 입력해 애플리케이션을 시작한다.

브라우저를 열고 http://localhost:8080 으로 접속하여 서버 상태를 확인한다.


JAR 파일이 실행되지 않을 때 조치 방법:

JDK 21이 올바르게 설치되었는지 확인하고, 환경 변수 MAIN_HOME 또는 JAVA_HOME 설정을 점검한다.

설정 방법: 시스템 환경 변수 편집 ➔ 환경 변수 ➔ 시스템 변수 ➔ JAVA_HOME이 없으면 새로 만들기 클릭 후 경로에 C:\Program Files\Java\jdk-21 입력

시스템 환경 변수 편집 ➔ 환경 변수 ➔ 사용자 변수 ➔ Path 선택 후 편집 ➔ %JAVA_HOME%\bin 추가

데이터베이스 연결 오류 발생 시 application.yml 파일의 설정 정보가 올바른지 확인한다.

Alternatively, 백엔드 루트 디렉토리에서 아래 명령어로 즉시 구동할 수도 있다.

PowerShell
.\gradlew bootRun

2-2. 프론트엔드 (React) 실행 방법

Powershell 또는 터미널을 열고 프론트엔드 프로젝트 디렉토리(deep-local-web)로 이동한다.

프로젝트 구동에 필요한 라이브러리 패키지를 다운로드한다. 
(용량 최적화를 위해 node_modules 폴더는 제외하고 압축 제출.)

Bash
npm install
설치가 완료되면 아래 명령어를 실행시켜 리액트 애플리케이션을 구동한다.

Bash
npm start
실행이 완료되면 브라우저를 통해 http://localhost:3000 으로 접속하여 메인 화면을 이용할 수 있다.

3. 실제 서버 배포처럼 작동시켜보기 (ngrok 터널링)
   
다른 사용자가 외부 URL을 통해 접속할 수 있도록 하거나, 프론트엔드와 백엔드 간의 원활한 HTTPS 보안 통신을 연동하기 위해 ngrok 터널링을 허용해 줄 수 있다.

ngrok 계정을 생성하고 PowerShell을 관리자 권한으로 열어 아래 명령어를 입력한다.

PowerShell
winget install ngrok.ngrok
ngrok 사이트의 [Your Authtoken] 메뉴에서 인증 토큰을 확인한 후, 아래 명령어를 입력하여 인증을 마친다. (이 과정은 최초 1회만 진행)

Bash
ngrok authtoken <인증받은_토큰>
백엔드가 구동 중인 상태에서 아래 명령어를 입력하여 8080 포트를 외부로 개방한다.

Bash
ngrok http 8080
실행 화면의 Forwarding 항목에 있는 URL (예: https://eleven-acquaint-strongly.ngrok-free.dev) 을 복사한다. 다른 사람들이 이 주소로 접근하면 로컬 백엔드 API 서버에 연결.

[주의사항] 

ngrok은 재실행할 때마다 도메인 주소가 새로 바뀌므로, 변경 시 프론트엔드 소스 코드 내 API 통신 주소를 일괄 수정해야 한다. 
또한 백엔드 애플리케이션이 실행 중인 상태여야 터널링 접속이 유지된다.

[필수: API 통신 전 ngrok 경고 화면 우회] 

프론트엔드에서 백엔드로 로그인 요청을 보내기 전, 브라우저에서 ngrok 보안 경고를 해제해야 합니다.

브라우저 새 탭을 열고 터미널에서 복사한 백엔드 ngrok 주소(https://....ngrok-free.dev) 로 직접 접속합니다.

화면에 파란색 ngrok 경고 창이 나타나면 화면 중앙의 [Visit Site] 버튼을 클릭합니다. (에러 페이지가 뜨면 성공입니다.)

다시 리액트 화면(http://localhost:3000) 으로 돌아와서 로그인을 진행하면 정상적으로 통신이 이루어집니다.

4. 간단한 사이트 이용 방법
   
사이트에 처음 접속하게 되면 회원가입을 진행하고 로그인을 완료해야 메인 페이지로 진입이 가능합니다.
로그인 계정은 권한에 따라 일반 사용자와 관리자 두 가지 유형으로 분류됩니다.

일반 사용자 로그인
정보 확인: 로그인 성공 후 본인의 프로필 영역에서 가입된 이메일 주소와 사용자 닉네임을 직관적으로 확인할 수 있습니다.

명소 검색 및 조회: 현지인들이 추천하는 숨은 명소를 카테고리 및 지역별로 탐색할 수 있으며, 구글 맵(Google Maps API) 연동을 통해 정확한 명소의 위치를 지도로 시각화하여 확인합니다.

리뷰 작성 및 희귀도 검증: 다녀온 장소에 대한 한 줄 리뷰를 남길 수 있습니다. 시스템의 내부 리뷰 희귀도(Rarity) 검증 알고리즘 로직에 따라 독창적인 리뷰 점수가 산정되는 현황을 오름차순 목록으로 상위 5개까지 정렬하여 조회할 수 있습니다.

실시간 다국어 변경: 화면 상단의 다국어 토글 버튼(KR, EN, JP, CN)을 사용하여 Context 기반으로 레이아웃 전반의 텍스트 사전 언어가 즉각적으로 최신화되는 기능을 활용할 수 있습니다.

로그아웃: 현재 세션을 종료하고 안전하게 초기 로그인/회원가입 페이지로 되돌아갑니다.


관리자 로그인
테스트 관리자 계정: admin1234@admin.com / 패스워드: admin1234

명소 및 홍보 등록 관리: 일반 사용자들이 커뮤니티 활성화를 위해 신규 신청한 숨은 명소 정보를 리스트로 모니터링하고, 검토 후 적합 여부에 따라 등록 승인 또는 거절 처리를 수행합니다. 승인된 장소는 전체 명소 보기 페이지에 즉시 추가됩니다.

리뷰 및 데이터 관리: 작성된 리뷰들의 희귀도 검증 로그를 모니터링하고 시스템 규칙에 위배되는 어뷰징 데이터를 필터링하거나 승인/거절 상태를 관리합니다.

로그아웃: 관리자 모드를 안전하게 해제하고 메인 인증 화면으로 빠져나옵니다.
