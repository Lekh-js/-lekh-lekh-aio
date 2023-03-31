import { InlinePropsKeys, ElementTypeKeys } from "../interfaces/custom-types";
import { MouseEventHandler } from "react";

interface MarkButtonProps {
  value: InlinePropsKeys | ElementTypeKeys;
  active: boolean;
  clickHandler: MouseEventHandler<HTMLButtonElement>;
}

export const ToolbarButton = ({
  value,
  active,
  clickHandler,
}: MarkButtonProps) => {
  return (
    <button
      title={value}
      type="button"
      onClick={clickHandler}
      className={`aspect-1 flex h-6 items-center justify-center rounded border outline-none ${
        active
          ? "border-neutral-100 bg-neutral-700"
          : "border-neutral-300 bg-white"
      }`}
    >
      {iconProvider(value, active)}
    </button>
  );
};

const iconProvider = (value: string, active: boolean) => {
  switch (value) {
    case InlinePropsKeys.Bold:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 96 960 960"
          className={`h-5 w-5 ${active ? "fill-white" : "fill-neutral-800"}`}
        >
          <path d="M275 856V296h228q66 0 114.5 42T666 444q0 38-21 70t-56 49v6q43 14 69.5 50t26.5 81q0 68-52.5 112T510 856H275Zm86-76h144q38 0 66-25t28-63q0-37-28-62t-66-25H361v175Zm0-247h136q35 0 60.5-23t25.5-58q0-35-25.5-58.5T497 370H361v163Z" />
        </svg>
      );
    case InlinePropsKeys.Italic:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 96 960 960"
          className={`h-5 w-5 ${active ? "fill-white" : "fill-neutral-800"}`}
        >
          <path d="M224 857v-80h134l139-409H338v-80h380v80H584L445 777h159v80H224Z" />
        </svg>
      );
    case InlinePropsKeys.Underline:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 96 960 960"
          className={`h-5 w-5 ${active ? "fill-white" : "fill-neutral-800"}`}
        >
          <path d="M200 916v-60h560v60H200Zm280-140q-100 0-156.5-58.5T267 559V216h83v343q0 63 34 101t96 38q62 0 96-38t34-101V216h83v343q0 100-56.5 158.5T480 776Z" />
        </svg>
      );
    case InlinePropsKeys.InlineCode:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 96 960 960"
          className={`h-5 w-5 ${active ? "fill-white" : "fill-neutral-800"}`}
        >
          <path d="M320 814 80 574l242-242 43 43-199 199 197 197-43 43Zm318 2-43-43 199-199-197-197 43-43 240 240-242 242Z" />
        </svg>
      );
    case InlinePropsKeys.Highlight:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 96 960 960"
          className={`h-5 w-5 ${active ? "fill-white" : "fill-neutral-800"}`}
        >
          <path d="m137 829 120-120-4-4q-22-22-21.5-55.5T254 594l401-401q17-17 43-17t43 17l112 112q17 17 16.5 45.5T852 396L451 797q-19 19-52.5 19T346 797l-11-11-43 43H137Zm437-355Zm57 58L516 417 283 650l115 115 233-233ZM80 1056V935h800v121H80Z" />
        </svg>
      );
    case ElementTypeKeys.Quote:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 96 960 960"
          className={`h-5 w-5 ${active ? "fill-white" : "fill-neutral-800"}`}
        >
          <path d="M580 556h160V396H580v160Zm-360 0h160V396H220v160Zm406 220 80-160H520V336h280v288l-76 152h-98Zm-360 0 80-160H160V336h280v288l-76 152h-98Zm34-300Zm360 0Z" />
        </svg>
      );
    case ElementTypeKeys.Paragraph:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 96 960 960"
          className={`h-5 w-5 ${active ? "fill-white" : "fill-neutral-800"}`}
        >
          <path d="M160 684v-60h640v60H160Zm0 160v-60h640v60H160Zm0-316v-60h640v60H160Zm0-160v-60h640v60H160Z" />
        </svg>
      );
    case ElementTypeKeys.Image:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 96 960 960"
          className={`h-5 w-5 ${active ? "fill-white" : "fill-neutral-800"}`}
        >
          <path d="M180 936q-24 0-42-18t-18-42V276q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600V276H180v600Zm56-97h489L578 583 446 754l-93-127-117 152Zm-56 97V276v600Z" />
        </svg>
      );
    case ElementTypeKeys.InlineLink:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 96 960 960"
          className={`h-5 w-5 ${active ? "fill-white" : "fill-neutral-800"}`}
        >
          <path d="M450 776H280q-83 0-141.5-58.5T80 576q0-83 58.5-141.5T280 376h170v60H280q-58.333 0-99.167 40.765-40.833 40.764-40.833 99Q140 634 180.833 675q40.834 41 99.167 41h170v60ZM325 606v-60h310v60H325Zm185 170v-60h170q58.333 0 99.167-40.765 40.833-40.764 40.833-99Q820 518 779.167 477 738.333 436 680 436H510v-60h170q83 0 141.5 58.5T880 576q0 83-58.5 141.5T680 776H510Z" />
        </svg>
      );
    case ElementTypeKeys.BlockLink:
      return (
        <svg width="13" height="14" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.567 13.629c.728.464 1.581.65 2.41.558l-.873.873A3.722 3.722 0 1 1 4.84 9.794L6.694 7.94a3.722 3.722 0 0 1 5.256-.008L10.484 9.4a5.209 5.209 0 0 1-.017.016 1.625 1.625 0 0 0-2.29.009l-1.854 1.854a1.626 1.626 0 0 0 2.244 2.35zm2.766-7.358a3.722 3.722 0 0 0-2.41-.558l.873-.873a3.722 3.722 0 1 1 5.264 5.266l-1.854 1.854a3.722 3.722 0 0 1-5.256.008L9.416 10.5a5.2 5.2 0 0 1 .017-.016 1.625 1.625 0 0 0 2.29-.009l1.854-1.854a1.626 1.626 0 0 0-2.244-2.35z"
            transform="translate(-3.667 -2.7)"
          />
        </svg>
      );
    case ElementTypeKeys.Heading:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-3 -3 47 47"
          className={`${active ? "fill-white" : "fill-neutral-800"}`}
        >
          <path d="M11.958 33.333V11.125H3.333V6.667H25v4.458h-8.625v22.208Zm15 0V19.458h-5.291V15h15v4.458h-5.292v13.875Z" />
        </svg>
      );
    case ElementTypeKeys.List:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="1 0 47 47"
          className={`${active ? "fill-white" : "fill-neutral-800"}`}
        >
          <path d="M18.85 38.1v-3H42v3Zm0-12.6v-3H42v3Zm0-12.65v-3H42v3Zm-9.4 27.1q-1.4 0-2.4-.95t-1-2.4q0-1.4.975-2.375Q8 33.25 9.45 33.25q1.4 0 2.35 1 .95 1 .95 2.4 0 1.35-.975 2.325-.975.975-2.325.975Zm0-12.6q-1.4 0-2.4-.975T6.05 24q0-1.4 1-2.375 1-.975 2.4-.975 1.35 0 2.325.975.975.975.975 2.375t-.975 2.375q-.975.975-2.325.975ZM9.4 14.7q-1.4 0-2.375-.975-.975-.975-.975-2.375t.975-2.375Q8 8 9.4 8t2.375.975q.975.975.975 2.375t-.975 2.375Q10.8 14.7 9.4 14.7Z" />
        </svg>
      );
    case ElementTypeKeys.Code:
      return (
        // <svg
        //   width="14"
        //   height="14"
        //   viewBox="0 -1 14 14"
        //   xmlns="http://www.w3.org/2000/svg"
        // >
        //   <path d="M3.177 6.852c.205.253.347.572.427.954.078.372.117.844.117 1.417 0 .418.01.725.03.92.02.18.057.314.107.396.046.075.093.117.14.134.075.027.218.056.42.083a.855.855 0 0 1 .56.297c.145.167.215.38.215.636 0 .612-.432.934-1.216.934-.457 0-.87-.087-1.233-.262a1.995 1.995 0 0 1-.853-.751 2.09 2.09 0 0 1-.305-1.097c-.014-.648-.029-1.168-.043-1.56-.013-.383-.034-.631-.06-.733-.064-.263-.158-.455-.276-.578a2.163 2.163 0 0 0-.505-.376c-.238-.134-.41-.256-.519-.371C.058 6.76 0 6.567 0 6.315c0-.37.166-.657.493-.846.329-.186.56-.342.693-.466a.942.942 0 0 0 .26-.447c.056-.2.088-.42.097-.658.01-.25.024-.85.043-1.802.015-.629.239-1.14.672-1.522C2.691.19 3.268 0 3.977 0c.783 0 1.216.317 1.216.921 0 .264-.069.48-.211.643a.858.858 0 0 1-.563.29c-.249.03-.417.076-.498.126-.062.04-.112.134-.139.291-.031.187-.052.562-.061 1.119a8.828 8.828 0 0 1-.112 1.378 2.24 2.24 0 0 1-.404.963c-.159.212-.373.406-.64.583.25.163.454.342.612.538zm7.34 0c.157-.196.362-.375.612-.538a2.544 2.544 0 0 1-.641-.583 2.24 2.24 0 0 1-.404-.963 8.828 8.828 0 0 1-.112-1.378c-.009-.557-.03-.932-.061-1.119-.027-.157-.077-.251-.14-.29-.08-.051-.248-.096-.496-.127a.858.858 0 0 1-.564-.29C8.57 1.401 8.5 1.185 8.5.921 8.5.317 8.933 0 9.716 0c.71 0 1.286.19 1.72.574.432.382.656.893.671 1.522.02.952.033 1.553.043 1.802.009.238.041.458.097.658a.942.942 0 0 0 .26.447c.133.124.364.28.693.466a.926.926 0 0 1 .493.846c0 .252-.058.446-.183.58-.109.115-.281.237-.52.371-.21.118-.377.244-.504.376-.118.123-.212.315-.277.578-.025.102-.045.35-.06.733-.013.392-.027.912-.042 1.56a2.09 2.09 0 0 1-.305 1.097c-.2.323-.486.574-.853.75a2.811 2.811 0 0 1-1.233.263c-.784 0-1.216-.322-1.216-.934 0-.256.07-.47.214-.636a.855.855 0 0 1 .562-.297c.201-.027.344-.056.418-.083.048-.017.096-.06.14-.134a.996.996 0 0 0 .107-.396c.02-.195.031-.502.031-.92 0-.573.039-1.045.117-1.417.08-.382.222-.701.427-.954z" />{" "}
        // </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-3.5 -4 55 55"
          className={`${active ? "fill-white" : "fill-neutral-800"}`}
        >
          <path d="m16 35.9-12-12 12.1-12.1 2.15 2.15L8.3 23.9l9.85 9.85Zm15.9.1-2.15-2.15 9.95-9.95-9.85-9.85L32 11.9l12 12Z" />
        </svg>
      );
    default:
      return <span>{value}</span>;
  }
};
