/* eslint-disable @next/next/no-img-element -- static brand files in the admin panel */

/** Login-screen logo: KNO Academy logo (light/dark admin themes) and the platform name. */
export function Logo() {
  return (
    <div className="sim-logo">
      <img className="sim-logo__light" src="/brand/kno-academy-logo.png" alt="KNO Academy" width={240} height={80} />
      <img className="sim-logo__dark" src="/brand/kno-academy-logo-on-dark.png" alt="KNO Academy" width={240} height={80} />
      <div className="sim-logo__name">
        Studying in Morocco <span>· الدراسة في المغرب</span>
      </div>
    </div>
  )
}

/** Navigation icon: the KNO Academy mark. */
export function Icon() {
  return <img src="/brand/kno-academy-mark.svg" alt="KNO Academy" width={30} height={23} />
}
