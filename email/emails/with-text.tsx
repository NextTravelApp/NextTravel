import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export function WithText({
  preview,
  heading,
  text,
}: {
  preview: string;
  heading: string;
  text: string;
}) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              primary: "#66B3FF",
            },
          },
        },
      }}
    >
      <Html>
        <Head>
          <Font
            fontFamily="Geist"
            fallbackFontFamily="Arial"
            webFont={{
              url: "https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Variable.woff2",
              format: "woff2",
            }}
          />
        </Head>
        <Preview>{preview}</Preview>
        <Body>
          <Container>
            <Heading as="h1">{heading}</Heading>

            <Section className="my-6">
              <Text className="text-base">{text}</Text>
            </Section>

            <Text className="text-base">
              <br />- NextTravel Team
            </Text>

            <Hr className="border-b-gray-400" />

            <Text className="text-sm">
              &copy; NextTravel 2024. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
