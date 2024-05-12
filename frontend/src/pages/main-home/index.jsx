import { Box, Grid, Card, CardHeader, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import Line from 'assets/images/line.png';

const contentGeneration = [
  {
    title: 'Email Explorer',
    description:
      'Draft relevant and compelling email copy to your target audience',
    tag: 'email-explorer',
  },
  {
    title: 'Blog Author',
    description: 'Turn ideas into SEO optimized blog content',
    tag: 'blog-author',
  },
  {
    title: 'Social Media Engine',
    description: 'Create engaging social media content, no matter the platform',
    tag: 'social-media-engine',
  },
  {
    title: 'Google Ad Copy',
    description: 'Draft high converting ad copy for your ad campaigns',
    tag: 'ad-copy-generator',
  },
  { title: 'BrainStorm', description: '', tag: 'brainstorm' },
];

const brandSettings = [
  { title: 'Brand Guidelines', tag: 'brand-guidelines' },
  { title: 'Archetype Explorer', tag: 'archetype-explorer' },
];

export default function MainHome() {
  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <p className="font-bold text-3xl mb-8">Content Generation</p>
      <Grid container spacing={12}>
        {contentGeneration.map((item, index) => (
          <Grid item md={4} key={index}>
            <Link to={item.tag}>
              <Card sx={{}}>
                <CardHeader
                  title={item.title}
                  sx={{ textAlign: 'center' }}
                ></CardHeader>
                <CardContent sx={{ px: 4, pb: 4, pt: 0 }}>
                  <img src={Line} alt="Line group" className="w-full" />
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ my: '24px' }}>
        <p className="font-bold text-3xl mb-8">Brand Settings</p>
        <Grid container sx={{ height: '50%' }} spacing={12}>
          {brandSettings.map(({ title, tag }, index) => (
            <Grid item md={4} key={index}>
              <Link to={tag}>
                <Card sx={{}}>
                  <CardHeader
                    title={title}
                    sx={{ textAlign: 'center' }}
                  ></CardHeader>
                  <CardContent sx={{ px: 4, pb: 4, pt: 0 }}>
                    <img
                      src={Line}
                      alt="Line group"
                      className="object-contain w-full"
                    />
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
