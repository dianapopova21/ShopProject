import React, { useRef, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import style from '../Login.module.scss'
import { useDispatch } from 'react-redux'
import { setUserInfoLogin } from '../../../../../../store/slices/userSlice'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { signOut } from 'firebase/auth'
import { toast } from 'react-toastify'
import { MdPerson } from 'react-icons/md'
import { GiEternalLove } from 'react-icons/gi'

export default function FormLogin({ setActive }) {
    const {
        label,
        input,
        autorisation,
        labelCheck,
        formRemmember,
        button,
        errmsg,
        offscreen,
        iconMan,
        back,
        blockLogin,
        desired,
        iconLove,
        flexDesired,
    } = style

    const dispatch = useDispatch()

    const userRef = useRef()
    const errRef = useRef()

    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [email, pwd])

    function notify() {
        toast('Wow, you Login in!')
    }

    function saveUserInfoRegister(email, pws) {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, pws)
            .then(({ user }) => {
                dispatch(
                    setUserInfoLogin({
                        email: user.email,
                        id: user.id,
                        token: user.accessToken,
                    })
                )
                notify()
                setActive(false)
            })
            .catch((error) => {
                if (error.code === 'auth/wrong-password') {
                    setErrMsg('Invalid password. Please try again.')
                } else if (error.code === 'auth/user-not-found') {
                    setErrMsg('User not found. Please check your email.')
                } else {
                    console.error(error)
                    setErrMsg('An error occurred while logging in.')
                }
            })
    }
    function removeUser() {
        const auth = getAuth()
        signOut(auth)
            .then(() => {
                dispatch(
                    setUserInfoLogin({
                        email: null,
                        id: null,
                        token: null,
                    })
                )
                notify()
                setActive(false)
                setSuccess(false)
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    setErrMsg(
                        'This email address is already registered. Please use a different email.'
                    )
                } else {
                    console.error(error)
                    setErrMsg('An error occurred while registering.')
                }
            })
    }

    async function handleLoginSubmit(event) {
        event.preventDefault()

        try {
            const auth = getAuth()
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                pwd
            )
            const user = userCredential.user

            dispatch(
                setUserInfoLogin({
                    email: user.email,
                    id: user.uid,
                    token: user.accessToken,
                })
            )
            notify()
            setActive(false)
            setSuccess(true)
        } catch (error) {
            console.error(error)
            setErrMsg('Invalid email or password. Please try again.')
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <div className={blockLogin}>
                        <h1>
                            <MdPerson className={iconMan} />
                        </h1>
                        <span>{email}</span>
                    </div>

                    <br />
                    <br />
                    <br />
                    <span className={flexDesired}>
                        <GiEternalLove className={iconLove} />
                        <NavLink className={desired} to="/desired">
                            Вподобання
                        </NavLink>
                    </span>

                    <br />
                    <br />
                    <p onClick={() => removeUser()}>
                        <span className={back} onClick={() => setActive(false)}>
                            <span onClick={() => setSuccess(false)}>
                                Вийти з профілю
                            </span>
                        </span>
                    </p>
                </section>
            ) : (
                <section>
                    <p
                        ref={errRef}
                        className={errMsg ? errmsg : offscreen}
                        aria-live="assertive"
                    >
                        {errMsg}
                    </p>
                    <form onSubmit={handleLoginSubmit}>
                        <div className={autorisation}>
                            <label className={label} htmlFor="username">
                                Email:
                            </label>
                            <input
                                type="email"
                                className={input}
                                ref={userRef}
                                id="email"
                                required
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />{' '}
                        </div>
                        <div className={autorisation}>
                            <label className={label} htmlFor="password">
                                Пароль
                            </label>
                            <input
                                type="password"
                                id="required"
                                className={input}
                                required
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                            />
                        </div>
                        <div className={formRemmember}>
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                />
                                <label class={labelCheck} for="">
                                    {' '}
                                    Запам'ятати вас{' '}
                                </label>
                            </div>
                        </div>
                        <button
                            onClick={() => saveUserInfoRegister(email, pwd)}
                            className={button}
                        >
                            Увійти
                        </button>
                    </form>
                </section>
            )}
        </>
    )
}
