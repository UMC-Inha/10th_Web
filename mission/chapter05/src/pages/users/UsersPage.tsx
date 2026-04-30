import PageLayout from '../../layouts/PageLayout';

function UsersPage() {
  return (
    <PageLayout
      title="유저 관리 페이지"
      description="GET /users/me, GET /users/:userId, PATCH/DELETE /users 관련 화면"
    />
  );
}

export default UsersPage;
