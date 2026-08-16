import React from 'react'

const BeforeLogin: React.FC = () => {
  return (
    <div>
      <p>
        <b>به داشبورد خوش آمدید!</b>
        {' اینجا مدیران سایت برای مدیریت وب‌سایت وارد می‌شوند.'}
      </p>
      <p style={{ opacity: 0.7, marginTop: '0.5rem', fontSize: '0.9em' }}>
        Welcome to your dashboard — site admins log in here to manage the website.
      </p>
    </div>
  )
}

export default BeforeLogin
