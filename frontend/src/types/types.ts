export type colorType =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
export type buttonType = "button" | "submit" | "reset" | undefined;

export type userInfoType = {
  loginFor?:"Projects" | "Designs" | null;
  email:string | null;
  password:string | null;
  confirmPassword?:string | null;
  field?:string | null;
};
