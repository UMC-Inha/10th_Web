// History API를 이용한 페이지 전환 함수
// React Router의 navigate()와 동일한 역할
export function navigate(path: string) {
  window.history.pushState(null, '', path);
  // popstate는 pushState에서 자동으로 발생하지 않으므로 직접 dispatch
  window.dispatchEvent(new PopStateEvent('popstate'));
}
