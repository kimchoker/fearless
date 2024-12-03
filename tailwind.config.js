module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Next.js의 기본 경로 (App Router 사용 시)
    "./pages/**/*.{js,ts,jsx,tsx}", // Pages Router 사용 시
    "./components/**/*.{js,ts,jsx,tsx}" // 컴포넌트 폴더 경로
  ],
  theme: {
    extend: {},
      fontFamily: {
        nexon: ['NEXONLv2Gothic', 'sans-serif'], // 사용자 정의 폰트
      },
  },
  plugins: [],
};
