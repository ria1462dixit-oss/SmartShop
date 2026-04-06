import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Separator,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FiArrowLeft, FiCheckCircle, FiMail, FiShield } from 'react-icons/fi'
import signupBg from '../assets/SignupBG(1).png'
import { beginGoogleOAuth, persistSession, requestEmailOtp, verifyEmailOtp } from '../lib/auth'

function isValidEmail(value) {
  return /\S+@\S+\.\S+/.test(value)
}

const infoCards = [
  {
    title: 'Google OAuth',
    body: 'One-tap sign-in once your Google app is connected.',
    icon: FcGoogle,
  },
  {
    title: 'Email OTP',
    body: 'Passwordless access with one-time verification.',
    icon: FiMail,
  },
  {
    title: 'Safer flow',
    body: 'Session is stored only after backend confirmation.',
    icon: FiShield,
  },
]

export default function SignInPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sendLoading, setSendLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [status, setStatus] = useState({
    tone: 'neutral',
    message: 'Use Google or request a one-time password to continue.',
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (!countdown) return undefined
    const timer = window.setTimeout(() => setCountdown((current) => current - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [countdown])

  const sendOtp = async () => {
    if (!isValidEmail(email)) {
      setStatus({ tone: 'error', message: 'Enter a valid email address before requesting an OTP.' })
      return
    }

    setSendLoading(true)
    setStatus({ tone: 'neutral', message: 'Requesting your OTP...' })

    try {
      const payload = await requestEmailOtp(email)
      setOtpSent(true)
      setCountdown(30)
      setStatus({
        tone: 'success',
        message: payload?.devOtp
          ? `Local mode OTP for ${email}: ${payload.devOtp}`
          : `OTP sent to ${email}. Enter the code to continue.`,
      })
    } catch (error) {
      setStatus({ tone: 'error', message: error.message })
    } finally {
      setSendLoading(false)
    }
  }

  const submitOtp = async () => {
    if (!otp.trim()) {
      setStatus({ tone: 'error', message: 'Enter the OTP you received.' })
      return
    }

    setSubmitLoading(true)
    setStatus({ tone: 'neutral', message: 'Verifying your code...' })

    try {
      const payload = await verifyEmailOtp({ email, otp, mode })
      persistSession(payload)
      setStatus({ tone: 'success', message: 'Signed in successfully. Redirecting to the store...' })
      window.setTimeout(() => navigate('/'), 1000)
    } catch (error) {
      setStatus({ tone: 'error', message: error.message })
    } finally {
      setSubmitLoading(false)
    }
  }

  const signInWithGoogle = () => {
    try {
      beginGoogleOAuth()
    } catch (error) {
      setStatus({ tone: 'error', message: error.message })
    }
  }

  return (
    <Flex minH="100vh" position="relative" overflow="hidden" bg="#ece5fb">
      <Box position="absolute" inset="0" zIndex={0}>
        <img
          src={signupBg}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </Box>

      <Button
        position="absolute"
        top={{ base: 4, md: 5 }}
        left={{ base: 4, md: 5 }}
        variant="ghost"
        leftIcon={<FiArrowLeft />}
        color="white"
        zIndex={2}
        fontSize="sm"
        _hover={{ bg: 'whiteAlpha.120' }}
        onClick={() => navigate('/')}
      >
        Back
      </Button>

      <Flex flex="1" />

      <Flex
        w={{ base: '100%', md: '360px', lg: '380px' }}
        minH="100vh"
        ml="auto"
        mr={{ base: 0, md: '8%', lg: '12%' }}
        justify="center"
        align="center"
        px={{ base: 4, md: 5 }}
        py={{ base: 7, md: 5 }}
        position="relative"
        zIndex={1}
      >
        <VStack align="stretch" spacing={4} w="100%" maxW="280px">
          <HStack
            bg="rgba(51, 29, 95, 0.9)"
            borderRadius="999px"
            p="3px"
            border="1px solid rgba(255,255,255,0.14)"
          >
            {[
              { id: 'login', label: 'Login' },
              { id: 'signup', label: 'SignUp' },
            ].map((option) => (
              <Button
                key={option.id}
                flex="1"
                h="38px"
                borderRadius="999px"
                bg={mode === option.id ? 'rgba(186, 157, 240, 0.98)' : 'transparent'}
                color="#fff"
                fontWeight="700"
                fontSize="sm"
                _hover={{ bg: mode === option.id ? 'rgba(186, 157, 240, 0.98)' : 'whiteAlpha.100' }}
                onClick={() => setMode(option.id)}
              >
                {option.label}
              </Button>
            ))}
          </HStack>

          <Stack spacing={3}>
            <HStack align="stretch" spacing={2}>
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter Email"
                h="38px"
                borderRadius="12px"
                bg="rgba(186, 157, 240, 0.96)"
                border="0"
                color="#fff"
                fontSize="xs"
                _placeholder={{ color: 'rgba(255,255,255,0.84)' }}
                _focus={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.5)' }}
              />
              <Button
                h="38px"
                minW="72px"
                borderRadius="12px"
                bg="rgba(186, 157, 240, 0.96)"
                color="#fff"
                fontWeight="700"
                fontSize="xs"
                _hover={{ bg: 'rgba(201, 173, 247, 1)' }}
                isLoading={sendLoading}
                onClick={sendOtp}
              >
                Send
              </Button>
            </HStack>

            <Input
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="OTP"
              h="38px"
              maxW="185px"
              borderRadius="12px"
              bg="rgba(186, 157, 240, 0.96)"
              border="0"
              color="#fff"
              fontSize="xs"
              _placeholder={{ color: 'rgba(255,255,255,0.84)' }}
              _focus={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.5)' }}
            />

            <HStack justify="space-between" maxW="185px" px={1}>
              <Button
                variant="link"
                color="whiteAlpha.820"
                fontSize="11px"
                fontWeight="500"
                isDisabled={!otpSent || countdown > 0 || sendLoading}
                onClick={sendOtp}
              >
                Resend
              </Button>
              <Text fontSize="11px" color="whiteAlpha.720">
                {countdown ? `${countdown}s` : 'Timer'}
              </Text>
            </HStack>
          </Stack>

          <Separator borderColor="whiteAlpha.260" />

          <VStack align="stretch" spacing={3}>
            {infoCards.map(({ title, body, icon: Icon }) => (
              <HStack
                key={title}
                align="start"
                spacing={2.5}
                borderRadius="16px"
                bg="rgba(255,255,255,0.08)"
                border="1px solid rgba(255,255,255,0.1)"
                p={3}
              >
                <Box pt="1px" color="whiteAlpha.920" fontSize="md">
                  <Icon />
                </Box>
                <Box>
                  <Text color="white" fontWeight="700" fontSize="xs" mb={0.5}>
                    {title}
                  </Text>
                  <Text color="whiteAlpha.760" fontSize="10px" lineHeight="1.5">
                    {body}
                  </Text>
                </Box>
              </HStack>
            ))}
          </VStack>

          <Box
            borderRadius="14px"
            bg={
              status.tone === 'error'
                ? 'rgba(120, 33, 66, 0.62)'
                : status.tone === 'success'
                  ? 'rgba(18, 86, 58, 0.48)'
                  : 'rgba(255,255,255,0.08)'
            }
            border="1px solid rgba(255,255,255,0.12)"
            p={3}
          >
            <HStack align="start" spacing={3}>
              <Box pt="2px" color="whiteAlpha.900">
                <FiCheckCircle />
              </Box>
              <Text fontSize="11px" color="white" lineHeight="1.65">
                {status.message}
              </Text>
            </HStack>
          </Box>

          <Button
            h="36px"
            borderRadius="999px"
            bg="rgba(186, 157, 240, 0.98)"
            color="#fff"
            fontWeight="700"
            fontSize="xs"
            _hover={{ bg: 'rgba(201, 173, 247, 1)' }}
            onClick={submitOtp}
            isLoading={submitLoading}
          >
            {mode === 'login' ? 'Continue with OTP' : 'Create account with OTP'}
          </Button>

          <Button
            h="36px"
            borderRadius="999px"
            bg="rgba(186, 157, 240, 0.98)"
            color="#fff"
            fontWeight="700"
            fontSize="xs"
            leftIcon={<FcGoogle />}
            _hover={{ bg: 'rgba(201, 173, 247, 1)' }}
            onClick={signInWithGoogle}
          >
            Login from Google
          </Button>
        </VStack>
      </Flex>
    </Flex>
  )
}
