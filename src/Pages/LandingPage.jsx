// hero carousel using your slider images
// “most loved products” carousel
// deals section
// category cards linking into category page
// footer/about/reviews sections
// anchor navigation targets for navbar (#deals, #about, #new-in)



import { useCallback, useEffect, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiInstagram,
  FiSearch,
  FiShoppingBag,
  FiTruck,
} from 'react-icons/fi'
import { FaFacebookF, FaPinterestP, FaStar } from 'react-icons/fa'
import { BsTwitterX } from 'react-icons/bs'
import heroSlider1 from '../assets/Hero_slider1.jpeg'
import heroSlider2 from '../assets/Hero_slider2.jpeg'
import heroSlider3 from '../assets/Hero_slider3.jpeg'
import StoreNavbar from '../components/StoreNavbar'
import catWomen from '../assets/Cat_W.jpg'
import catMen from '../assets/Cat_M.jpg'
import catFurniture from '../assets/Cat_F.jpg'
import catSkincare from '../assets/Cat_S.jpg'
import { getCategoryProducts } from '../lib/products'

const C = {
  sand: '#f7f1ea',
  paper: '#fffdfa',
  ink: '#211c2d',
  rose: '#d9466f',
  gold: '#f2a43c',
  plum: '#5e4bb6',
  mint: '#2dbb94',
  coral: '#ef6b57',
}

const heroSlides = [
  {
    id: 1,
    tag: 'New & Now',
    headline: 'New lines for real life',
    sub: 'Soft tailoring, easy layers, and pieces you will keep reaching for.',
    cta: 'Start shopping',
    bg: '#221735',
    accent: C.rose,
    image: heroSlider1,
  },
  {
    id: 2,
    tag: 'Season Edit',
    headline: 'Summer made simpler',
    sub: 'Light fabrics and bold colors, curated for weekend plans and everyday ease.',
    cta: 'Shop the sale',
    bg: '#161623',
    accent: C.gold,
    image: heroSlider2,
  },
  {
    id: 3,
    tag: 'Fresh Drop',
    headline: 'A collection with personality',
    sub: 'Designed to feel modern, wearable, and just a little more expressive.',
    cta: 'Explore now',
    bg: '#1e1535',
    accent: C.plum,
    image: heroSlider3,
  },
]

const categories = [
  { name: 'Women', image: catWomen, bg: C.gold, target: '/category?section=women' },
  { name: 'Men', image: catMen, bg: C.plum, target: '/category?section=men' },
  { name: 'Skincare', image: catSkincare, bg: C.mint, target: '/category?section=skincare' },
  { name: 'Furniture', image: catFurniture, bg: C.coral, target: '/category?section=home' },
]

const reviews = [
  { name: 'Rahul Sharma', city: 'Mumbai', stars: 5, text: 'The quality feels much better than what I expected online. Everything arrived fast and looked exactly right.' },
  { name: 'Priya Mehta', city: 'Delhi', stars: 5, text: 'The styling feels thoughtful instead of generic. I ended up buying one thing and coming back for two more.' },
  { name: 'Anita Kapoor', city: 'Bengaluru', stars: 4, text: 'Smooth checkout, beautiful packaging, and a site that makes it easy to find pieces that feel personal.' },
  { name: 'Vikram Nair', city: 'Chennai', stars: 5, text: 'The home edit is genuinely good. It feels curated, not crowded, and the details stand out.' },
]

function Stars({ count }) {
  return (
    <HStack gap={1}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Box key={index} color={index < count ? C.gold : '#d3cfda'}>
          <FaStar />
        </Box>
      ))}
    </HStack>
  )
}

function Dots({ count, selected, accent }) {
  return (
    <Flex gap={2} justify="center">
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          w={index === selected ? '22px' : '8px'}
          h="8px"
          borderRadius="full"
          bg={index === selected ? accent : 'whiteAlpha.400'}
          transition="all 0.3s ease"
        />
      ))}
    </Flex>
  )
}

function ProductCarousel({ products, navigate }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 })
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <Box position="relative">
      {[
        { side: 'left', action: scrollPrev, icon: FiChevronLeft },
        { side: 'right', action: scrollNext, icon: FiChevronRight },
      ].map(({ side, action, icon: Icon }) => (
        <Flex
          key={side}
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          {...{ [side]: -4 }}
          w="42px"
          h="42px"
          borderRadius="full"
          bg={C.rose}
          color="white"
          align="center"
          justify="center"
          cursor="pointer"
          boxShadow="lg"
          transition="all 0.2s ease"
          _hover={{ bg: C.coral, transform: 'translateY(-50%) scale(1.05)' }}
          onClick={action}
        >
          <Icon />
        </Flex>
      ))}

      <Box overflow="hidden" ref={emblaRef}>
        <Flex gap={4} py={2}>
          {products.map((product) => (
            <Box
              key={product.id}
              flex="0 0 320px"
              minW={0}
              bg="white"
              role="group"
              borderRadius="3xl"
              overflow="hidden"
              boxShadow="md"
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{ transform: 'translateY(-6px)', boxShadow: 'xl' }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <Flex h="320px" align="center" justify="center" overflow="hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  transition="transform 0.35s ease"
                  _groupHover={{ transform: 'scale(1.04)' }}
                />
              </Flex>
              <Box p={5} bg="white">
                <Badge bg={C.plum} color="white" fontSize="10px" borderRadius="full" px={3} py={1} mb={2}>
                  {product.filter}
                </Badge>
                <Text fontWeight="800" fontSize="sm" color={C.rose} textTransform="uppercase" letterSpacing="0.14em" mb={1}>
                  {product.brand}
                </Text>
                <Text fontWeight="900" fontSize="xl" color={C.ink} mb={1}>
                  {product.name}
                </Text>
                <Text color="#6a6475" fontSize="sm" mb={3}>
                  {product.title}
                </Text>
                <Text fontWeight="900" color={C.rose} fontSize="lg">
                  Rs. {product.price}
                </Text>
              </Box>
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  )
}

export default function LandingPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 25 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const currentSlide = heroSlides[selectedIndex]
  const lovedProducts = useMemo(
    () => [
      getCategoryProducts('women')[0],
      getCategoryProducts('men')[0],
      getCategoryProducts('home')[0],
      getCategoryProducts('skincare')[0],
      getCategoryProducts('women')[1],
    ].filter(Boolean),
    [],
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const updateSelection = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', updateSelection)
    updateSelection()

    const timer = window.setInterval(() => emblaApi.scrollNext(), 4500)
    return () => window.clearInterval(timer)
  }, [emblaApi])

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      window.setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
    }
  }, [location.hash])

  return (
    <Box bg={C.sand} minH="100vh" color={C.ink}>
      <StoreNavbar cartCount={3} />

      <Box position="relative">
        <Box overflow="hidden" ref={emblaRef}>
          <Flex>
            {heroSlides.map((slide) => (
              <Flex
                key={slide.id}
                flex="0 0 100%"
                minW={0}
                minH={{ base: '560px', md: '620px' }}
                bg={slide.bg}
                position="relative"
                align="center"
                px={{ base: 6, md: 16 }}
                py={{ base: 10, md: 16 }}
                direction={{ base: 'column', md: 'row' }}
                overflow="hidden"
                gap={{ base: 8, md: 12 }}
              >
                <Box
                  position="absolute"
                  inset={0}
                  bgImage={`url(${slide.image})`}
                  bgSize="cover"
                  bgPos="center"
                  opacity={0.18}
                />
                <Box
                  position="absolute"
                  right={{ base: '-40px', md: '7%' }}
                  top={{ base: '8%', md: '18%' }}
                  w={{ base: '160px', md: '280px' }}
                  h={{ base: '160px', md: '280px' }}
                  borderRadius="full"
                  bg={slide.accent}
                  opacity={0.14}
                  filter="blur(72px)"
                />

                <Box flex="1" maxW="540px" zIndex={1}>
                  <Badge
                    mb={4}
                    bg={slide.accent}
                    color="white"
                    px={4}
                    py={1.5}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="800"
                    letterSpacing="widest"
                  >
                    {slide.tag}
                  </Badge>
                  <Heading
                    fontSize={{ base: '4xl', md: '6xl' }}
                    fontWeight="900"
                    color="white"
                    lineHeight="0.95"
                    mb={5}
                    fontFamily="'Georgia', serif"
                  >
                    {slide.headline}
                  </Heading>
                  <Text color="whiteAlpha.800" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.8" mb={7}>
                    {slide.sub}
                  </Text>
                  <HStack gap={4} flexWrap="wrap">
                    <Button
                      bg={slide.accent}
                      color="white"
                      borderRadius="full"
                      px={8}
                      py={6}
                      fontWeight="800"
                      rightIcon={<FiArrowRight />}
                      _hover={{ transform: 'translateY(-3px)', boxShadow: `0 16px 30px ${slide.accent}55` }}
                      transition="all 0.25s ease"
                      onClick={() => navigate('/category')}
                    >
                      {slide.cta}
                    </Button>
                    <Button
                      variant="outline"
                      borderRadius="full"
                      px={8}
                      py={6}
                      color="white"
                      borderColor="whiteAlpha.400"
                      _hover={{ bg: 'whiteAlpha.100', borderColor: 'whiteAlpha.700' }}
                      onClick={() => navigate('/login')}
                    >
                      Sign in
                    </Button>
                  </HStack>
                </Box>

                <Flex flex="1" align="center" justify="center" zIndex={1}>
                  <Image
                    src={slide.image}
                    alt={slide.headline}
                    maxH={{ base: '320px', md: '520px' }}
                    objectFit="contain"
                    borderRadius="2xl"
                    boxShadow="0 20px 50px rgba(0,0,0,0.22)"
                  />
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Box>

        {[
          { side: 'left', action: scrollPrev, icon: FiChevronLeft },
          { side: 'right', action: scrollNext, icon: FiChevronRight },
        ].map(({ side, action, icon: Icon }) => (
          <Flex
            key={side}
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            {...{ [side]: { base: 3, md: 8 } }}
            w={{ base: '42px', md: '48px' }}
            h={{ base: '42px', md: '48px' }}
            borderRadius="full"
            bg="whiteAlpha.200"
            backdropFilter="blur(8px)"
            color="white"
            align="center"
            justify="center"
            cursor="pointer"
            transition="all 0.2s ease"
            _hover={{ bg: 'whiteAlpha.300' }}
            onClick={action}
          >
            <Icon />
          </Flex>
        ))}

        <Box position="absolute" bottom={5} w="full">
          <Dots count={heroSlides.length} selected={selectedIndex} accent={currentSlide.accent} />
        </Box>
      </Box>

      <Box id="new-in" py={16} px={{ base: 6, md: 14 }} bg="white">
        <VStack mb={10} gap={2}>
          <Text fontSize="sm" fontWeight="700" color={C.plum} letterSpacing="widest">
            HANDPICKED FOR YOU
          </Text>
          <Heading fontSize={{ base: '2xl', md: '4xl' }} color={C.ink} fontFamily="'Georgia', serif" textAlign="center">
            Our most-loved products
          </Heading>
          <Text color="#6a6475" textAlign="center" maxW="2xl">
            A tighter, more intentional edit of the pieces customers come back for most.
          </Text>
        </VStack>
        <ProductCarousel products={lovedProducts} navigate={navigate} />
      </Box>

      <Grid id="deals" templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={0} mx={{ base: 4, md: 14 }} my={10} borderRadius="3xl" overflow="hidden" boxShadow="xl">
        <Box bg={C.gold} p={{ base: 8, md: 10 }}>
          <Badge bg="white" color={C.gold} px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="800" mb={4}>
            LIMITED TIME
          </Badge>
          <Heading fontSize={{ base: '2xl', md: '3xl' }} color="white" mb={3} fontFamily="'Georgia', serif">
            Summer offer
          </Heading>
          <Text fontSize={{ base: '5xl', md: '7xl' }} fontWeight="900" color="white" lineHeight="1">
            20%
          </Text>
          <Text color="whiteAlpha.900" fontSize="sm" mb={6}>
            Orders above Rs. 999 with code `SUMMER20`
          </Text>
          <Button bg="white" color={C.gold} borderRadius="full" px={6} fontWeight="800" onClick={() => navigate('/category')}>
            Claim offer
          </Button>
        </Box>

        <Box bg={C.ink} p={{ base: 8, md: 10 }} position="relative" overflow="hidden">
          <Box position="absolute" right="-24px" top="-18px" w="160px" h="160px" borderRadius="full" bg={C.plum} opacity={0.25} filter="blur(48px)" />
          <Badge bg={C.mint} color={C.ink} px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="800" mb={4}>
            NEW & BETTER
          </Badge>
          <Heading fontSize={{ base: '2xl', md: '3xl' }} color="white" mb={3} fontFamily="'Georgia', serif">
            Premium quality,
            <br />
            unmatched style
          </Heading>
          <Text color="whiteAlpha.700" fontSize="sm" mb={6} maxW="sm">
            Curated collections with more character, better visual rhythm, and cleaner navigation across the store.
          </Text>
          <Button bg={C.plum} color="white" borderRadius="full" px={6} rightIcon={<FiArrowRight />} onClick={() => navigate('/category')}>
            Explore
          </Button>
        </Box>
      </Grid>

      <Container maxW="7xl" py={14}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={5}>
          {categories.map((category) => (
            <GridItem
              key={category.name}
              bg={category.bg}
              borderRadius="3xl"
              p={4}
              minH="320px"
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{ transform: 'translateY(-6px)', boxShadow: `0 18px 35px ${category.bg}77` }}
              onClick={() => navigate(category.target)}
            >
              <Flex direction="column" h="100%" justify="space-between" gap={4}>
                <Image src={category.image} alt={category.name} h="240px" w="100%" objectFit="cover" borderRadius="22px" />
                <Text fontWeight="900" color="white" fontSize="xl" letterSpacing="wide">
                  {category.name}
                </Text>
              </Flex>
            </GridItem>
          ))}
        </Grid>
      </Container>

      <Box py={16} px={{ base: 4, md: 14 }} bg="white">
        <VStack mb={10} gap={2}>
          <Text fontSize="sm" fontWeight="700" color={C.gold} letterSpacing="widest">
            HEAR IT FROM OUR CUSTOMERS
          </Text>
          <Heading fontSize={{ base: '2xl', md: '3xl' }} color={C.ink} fontFamily="'Georgia', serif" textAlign="center">
            What people are saying
          </Heading>
        </VStack>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={5}>
          {reviews.map((review) => (
            <Box
              key={review.name}
              bg={C.sand}
              borderRadius="3xl"
              p={6}
              border="1px solid #ece3da"
              transition="all 0.25s ease"
              _hover={{ boxShadow: 'md', transform: 'translateY(-3px)' }}
            >
              <Stars count={review.stars} />
              <Text mt={4} color={C.ink} fontSize="sm" lineHeight="1.9" fontStyle="italic">
                "{review.text}"
              </Text>
              <Flex mt={5} align="center" gap={3}>
                <Flex w="42px" h="42px" borderRadius="full" bg={C.plum} color="white" align="center" justify="center" fontWeight="800">
                  {review.name[0]}
                </Flex>
                <Box>
                  <Text fontWeight="700" fontSize="sm" color={C.ink}>{review.name}</Text>
                  <Text fontSize="xs" color="#7f798b">{review.city}</Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </Grid>
      </Box>

      <Box id="about" bg={C.ink} color="white" px={{ base: 6, md: 14 }} py={12}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={8} mb={10}>
          <Box>
            <Heading fontSize="xl" fontWeight="900" letterSpacing="widest" mb={3} fontFamily="'Georgia', serif">
              SMART<Text as="span" color={C.rose}>SHOP</Text>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="sm" lineHeight="1.8">
              Fashion and home finds that feel considered, not cluttered.
            </Text>
            <HStack mt={5} gap={3}>
              {[
                { label: 'Instagram', icon: FiInstagram },
                { label: 'Facebook', icon: FaFacebookF },
                { label: 'X', icon: BsTwitterX },
                { label: 'Pinterest', icon: FaPinterestP },
              ].map(({ label, icon: Icon }) => (
                <Flex
                  key={label}
                  w="38px"
                  h="38px"
                  borderRadius="full"
                  bg="whiteAlpha.100"
                  align="center"
                  justify="center"
                  cursor="pointer"
                  transition="all 0.2s ease"
                  _hover={{ bg: C.rose }}
                >
                  <Icon />
                </Flex>
              ))}
            </HStack>
          </Box>

          {[
            { title: 'Shop', links: ['Women', 'Men', 'Skincare', 'Furniture'] },
            { title: 'Help', links: ['Track order', 'Returns', 'FAQs', 'Contact us'] },
            { title: 'Company', links: ['About us', 'Careers', 'Press', 'Sustainability'] },
          ].map((column) => (
            <Box key={column.title}>
              <Text fontWeight="800" mb={4} color={C.gold} letterSpacing="wider" fontSize="sm">
                {column.title.toUpperCase()}
              </Text>
              <VStack align="start" gap={2}>
                {column.links.map((link) => (
                  <Text key={link} fontSize="sm" color="whiteAlpha.700" cursor="pointer" _hover={{ color: 'white' }}>
                    {link}
                  </Text>
                ))}
              </VStack>
            </Box>
          ))}
        </Grid>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mb={8}>
          {[
            { title: 'Fast delivery', body: 'Dispatch updates that keep customers in the loop.', icon: FiTruck },
            { title: 'Thoughtful curation', body: 'Fewer distractions, better collections.', icon: FiHeart },
            { title: 'Easy sign-in', body: 'Google OAuth or email OTP, ready for backend hookup.', icon: FiShoppingBag },
          ].map(({ title, body, icon: Icon }) => (
            <Flex key={title} bg="whiteAlpha.100" borderRadius="2xl" p={4} gap={3} align="start">
              <Flex w="42px" h="42px" borderRadius="full" bg="whiteAlpha.200" align="center" justify="center">
                <Icon />
              </Flex>
              <Box>
                <Text fontWeight="800">{title}</Text>
                <Text color="whiteAlpha.700" fontSize="sm">{body}</Text>
              </Box>
            </Flex>
          ))}
        </Grid>

        <Flex borderTop="1px solid" borderColor="whiteAlpha.200" pt={6} justify="space-between" align="center" flexDir={{ base: 'column', md: 'row' }} gap={3}>
          <Text fontSize="xs" color="whiteAlpha.500">
            Copyright 2026 SmartShop. All rights reserved.
          </Text>
          <HStack gap={4}>
            {['Privacy policy', 'Terms', 'Cookies'].map((item) => (
              <Text key={item} fontSize="xs" color="whiteAlpha.500" cursor="pointer" _hover={{ color: 'white' }}>
                {item}
              </Text>
            ))}
          </HStack>
        </Flex>
      </Box>
    </Box>
  )
}
