import {
  Card,
  Container,
  Title,
  Text,
  Button,
  Stack,
  Center,
  Loader,
  Alert,
  Grid,
  Tabs,
} from '@mantine/core';
import { trpc } from '~/utils/trpc';
import { createServerSideProps } from '~/server/utils/server-side-helpers';
import { SubscribeButton } from '~/components/Stripe/SubscribeButton';
import { PlanDetails } from '~/components/Stripe/PlanDetails';
import { ManageSubscriptionButton } from '~/components/Stripe/ManageSubscriptionButton';
import { IconCalendarDue, IconHeartHandshake } from '@tabler/icons';

export default function Pricing() {
  const { data: products, isLoading: productsLoading } = trpc.stripe.getPlans.useQuery();
  const { data: subscription, isLoading: subscriptionLoading } =
    trpc.stripe.getUserSubscription.useQuery();

  // TODO - add button functionality
  const isLoading = productsLoading || subscriptionLoading;
  const showSubscribeButton = !subscription;

  return (
    <>
      <Container size="sm" mb="lg">
        <Stack>
          <Title align="center">Support Us ❤️</Title>
          <Text align="center" sx={{ lineHeight: 1.25 }}>
            {`Support Civitai and get exclusive perks. As the leading model sharing service, we're proud to be ad-free and adding new features every week. Help us keep the community thriving by becoming a member or making a donation.`}
          </Text>
        </Stack>
      </Container>
      <Container>
        <Tabs variant="outline" defaultValue="subscribe">
          <Tabs.List position="center">
            <Tabs.Tab value="subscribe" icon={<IconCalendarDue size={20} />}>
              Subscribe
            </Tabs.Tab>
            <Tabs.Tab value="donate" icon={<IconHeartHandshake size={20} />}>
              Donate
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="subscribe" pt="md">
            <Stack>
              {isLoading ? (
                <Center p="xl">
                  <Loader />
                </Center>
              ) : !products ? (
                <Center>
                  <Alert p="xl" title="There are no products to display">
                    Check back in a little while to see what we have to offer
                  </Alert>
                </Center>
              ) : (
                <Grid justify="center">
                  {products.map((product) => (
                    <Grid.Col key={product.id} md={5} sm={6} xs={12}>
                      <Card withBorder style={{ height: '100%' }}>
                        <Stack justify="space-between" style={{ height: '100%' }}>
                          <PlanDetails
                            name={product.name}
                            description={product.description}
                            unitAmount={product.price.unitAmount}
                            currency={product.price.currency}
                            interval={product.price.interval}
                          />
                          {showSubscribeButton && (
                            <SubscribeButton priceId={product.price.id}>
                              <Button>Subscribe</Button>
                            </SubscribeButton>
                          )}
                        </Stack>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              )}
              {!!subscription && (
                <Center>
                  <ManageSubscriptionButton>
                    <Button>Manage your Subscription</Button>
                  </ManageSubscriptionButton>
                </Center>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="donate" pt="md">
            Something
          </Tabs.Panel>
        </Tabs>
      </Container>
    </>
  );
}

export const getServerSideProps = createServerSideProps({
  useSSG: true,
  resolver: async ({ ssg }) => {
    await ssg?.stripe.getPlans.prefetch();
    await ssg?.stripe.getUserSubscription.prefetch();
  },
});
