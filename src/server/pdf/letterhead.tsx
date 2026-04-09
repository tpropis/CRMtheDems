import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

export interface BrandConfig {
  firmName: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  website?: string
  barNumber?: string
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
  tagline?: string
  letterheadStyle: 'classic' | 'centered' | 'minimal' | 'court'
  footerText?: string
  showBarNumber?: boolean
  showWebsite?: boolean
}

function makeStyles(brand: BrandConfig) {
  return StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a1a', paddingTop: 0, paddingBottom: 60, paddingHorizontal: 0 },
    header: { paddingHorizontal: 54, paddingTop: 36, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: brand.primaryColor, marginBottom: 24 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logo: { width: 48, height: 48, objectFit: 'contain' },
    firmName: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: brand.primaryColor },
    tagline: { fontSize: 7, color: '#888', marginTop: 2 },
    headerRight: { textAlign: 'right', fontSize: 8, color: '#555', lineHeight: 1.5 },
    headerCenter: { alignItems: 'center' },
    body: { paddingHorizontal: 54, lineHeight: 1.6 },
    footer: { position: 'absolute', bottom: 20, left: 54, right: 54, borderTopWidth: 1, borderTopColor: brand.secondaryColor, paddingTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    footerText: { fontSize: 7, color: '#888' },
    pageNumber: { fontSize: 7, color: '#aaa' },
    paragraph: { marginBottom: 10, fontSize: 10, lineHeight: 1.6 },
    bold: { fontFamily: 'Helvetica-Bold' },
  })
}

function Header({ brand, styles }: { brand: BrandConfig; styles: ReturnType<typeof makeStyles> }) {
  const addressLine = [brand.address, brand.city && brand.state ? `${brand.city}, ${brand.state} ${brand.zipCode}` : ''].filter(Boolean).join('\n')
  if (brand.letterheadStyle === 'centered') {
    return (
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          {brand.logoUrl && <Image src={brand.logoUrl} style={styles.logo} />}
          <Text style={styles.firmName}>{brand.firmName}</Text>
          {brand.tagline && <Text style={styles.tagline}>{brand.tagline}</Text>}
          <Text style={{ ...styles.headerRight, textAlign: 'center', marginTop: 4 }}>{addressLine}{brand.phone ? `\n${brand.phone}` : ''}</Text>
        </View>
      </View>
    )
  }
  if (brand.letterheadStyle === 'court') {
    return (
      <View style={{ ...styles.header, borderBottomColor: '#999', borderBottomWidth: 1 }}>
        <Text style={{ ...styles.firmName, fontSize: 11 }}>{brand.firmName}</Text>
        <Text style={styles.headerRight}>{addressLine} · {brand.phone}</Text>
      </View>
    )
  }
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          {brand.logoUrl && <Image src={brand.logoUrl} style={styles.logo} />}
          <View>
            <Text style={styles.firmName}>{brand.firmName}</Text>
            {brand.tagline && <Text style={styles.tagline}>{brand.tagline}</Text>}
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text>{addressLine}</Text>
          {brand.phone && <Text>{brand.phone}</Text>}
          {brand.showWebsite && brand.website && <Text>{brand.website}</Text>}
          {brand.showBarNumber && brand.barNumber && <Text>Bar No. {brand.barNumber}</Text>}
        </View>
      </View>
    </View>
  )
}

export function LetterheadDocument({ brand, content, title }: { brand: BrandConfig; content: string; title: string }) {
  const styles = makeStyles(brand)
  const paragraphs = content.split('\n\n').filter(Boolean)
  const footerText = brand.footerText || 'Confidential — Attorney-Client Privileged Communication'

  return (
    <Document title={title} author={brand.firmName}>
      <Page size="LETTER" style={styles.page}>
        <Header brand={brand} styles={styles} />
        <View style={styles.body}>
          {paragraphs.map((p, i) => (
            <Text key={i} style={styles.paragraph}>{p.trim()}</Text>
          ))}
        </View>
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{footerText}</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
