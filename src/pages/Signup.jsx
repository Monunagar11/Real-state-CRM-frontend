import React from 'react'

function Signup() {
  return (
    <div className='container'>
        <h1>Signup</h1>
        <form>
            <div className='mb-3'>
                <label htmlFor='email' className='form-label'>Email</label>
                <input type='email' className='form-control' id='email' placeholder='Enter your email' />
            </div>
            <div className='mb-3'>
                <label htmlFor='password' className='form-label'>Password</label>
                <input type='password' className='form-control' id='password' placeholder='Enter your password' />
            </div>
            <button type='submit' className='btn btn-primary'>Signup</button>
        </form>
    </div>
  )
}

export default Signup
