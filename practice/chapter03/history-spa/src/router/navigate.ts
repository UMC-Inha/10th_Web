function navigate(url: string, replace?: boolean, state?: object) {
  if (replace) {
    // replaceState: 현재 히스토리 항목을 교체 (뒤로가기 시 이전 페이지로 감)
    window.history.replaceState(state, "", url);
  } else {
    // pushState: 히스토리 스택에 새 항목 추가 (뒤로가기 가능)
    window.history.pushState(state, "", url);
  }

  // pushState/replaceState는 popstate 이벤트를 발생시키지 않으므로 수동으로 dispatch
  window.dispatchEvent(new PopStateEvent("popstate"));

  // 페이지 이동 시 스크롤을 맨 위로
  window.scrollTo(0, 0);
}

export default navigate;
