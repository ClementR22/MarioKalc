import InfoToast from "@/components/InfoToast";

export const toastConfig = {
  info: (props: any) => <InfoToast text1={props.text1} />,
  error: (props: any) => <InfoToast text1={props.text1} isError={true} />,
};
