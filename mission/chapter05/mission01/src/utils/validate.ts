export interface UserSigninInformation {
  email: string;
  password: string;
}

export const validateSignin = (values: UserSigninInformation) => {
  const errors: Record<keyof UserSigninInformation, string> = {
    email: "",
    password: "",
  };

  if (!values.email.includes("@")) {
    errors.email = "올바른 이메일 형식이 아닙니다.";
  }
  if (values.password.length < 4) {
    errors.password = "비밀번호는 4자리 이상이어야 합니다.";
  }

  return errors;
};