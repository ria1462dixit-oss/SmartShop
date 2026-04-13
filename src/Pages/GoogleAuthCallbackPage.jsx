import { useEffect, useState } from 'react'
import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { exchangeGoogleCode, persistSession } from '../lib/auth'

export default function GoogleAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState('Completing your Google sign-in...')
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      setMessage('Google sign-in was cancelled or denied.')
      return
    }

    if (!code) {
      setMessage('Missing Google authorization code.')
      return
    }

    exchangeGoogleCode(code)
      .then((payload) => {
        persistSession(payload)
        const requestedNextPath = window.localStorage.getItem('smartshop.loginNext') || '/'
        const nextPath = requestedNextPath.startsWith('/') ? requestedNextPath : '/'
        window.localStorage.removeItem('smartshop.loginNext')
        setMessage('Your account is ready. Redirecting you...')
        window.setTimeout(() => navigate(nextPath), 1200)
      })
      .catch((err) => {
        setMessage(err.message)
      })
  }, [navigate, searchParams])

  return (
    <Flex minH="100vh" bg="#f7f1ea" align="center" justify="center" px={6}>
      <Box
        bg="white"
        borderRadius="3xl"
        boxShadow="xl"
        maxW="md"
        w="full"
        p={{ base: 8, md: 10 }}
        textAlign="center"
      >
        <Spinner color="#d9466f" size="xl" mb={5} />
        <Text fontSize="2xl" fontWeight="800" color="#1e1e2e" mb={3}>
          SmartShop
        </Text>
        <Text color="#5a5566" lineHeight="1.8">
          {message}
        </Text>
      </Box>
    </Flex>
  )
}
