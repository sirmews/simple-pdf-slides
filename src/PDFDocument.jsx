import React from 'react';
import { Document, Page, Text, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts with emoji support
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVc.ttf' },
    { src: 'https://fonts.gstatic.com/s/opensans/v40/memQYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWq8tWZ0Pw86hd0Rk8ZkWVAewA.ttf', fontWeight: 'bold' }
  ]
});

Font.register({
  family: 'Times',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/crimsontext/v19/wlp2gwHKFkZgtmSR3NB0oRJvaAJSA_JN3Q.ttf' },
    { src: 'https://fonts.gstatic.com/s/crimsontext/v19/wlpogwHKFkZgtmSR3NB0oRJX-i2Zt8hbXQ.ttf', fontWeight: 'bold' }
  ]
});

Font.register({
  family: 'Courier',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/sourcecodepro/v23/HI_diYsKILxRpg3hIP6sJ7fM7PqPMcMnZFqUwX28DEyQhM5hLvXkDQ.ttf' },
    { src: 'https://fonts.gstatic.com/s/sourcecodepro/v23/HI_diYsKILxRpg3hIP6sJ7fM7PqPMcMnZFqUwX28DMyQhM5hLvXkDQ.ttf', fontWeight: 'bold' }
  ]
});

// Register emoji font for Unicode support
Font.register({
  family: 'NotoEmoji',
  src: 'https://fonts.gstatic.com/s/notocoloremoji/v30/Yq6P-KqIXTD0t4D9z1ESnKM3-HpFab5s79iz64w.woff2'
});

const createStyles = (backgroundColor, textColor, secondaryTextColor, font) => StyleSheet.create({
  page: {
    backgroundColor: backgroundColor,
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: textColor,
    fontFamily: font === 'helvetica' ? 'Helvetica' : font === 'times' ? 'Times' : 'Courier',
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    fontSize: font === 'courier' ? 18 : 22,
    color: textColor,
    fontFamily: font === 'helvetica' ? 'Helvetica' : font === 'times' ? 'Times' : 'Courier',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  contentWithoutTitle: {
    fontSize: font === 'courier' ? 20 : 26,
    fontWeight: 'bold',
    color: textColor,
    fontFamily: font === 'helvetica' ? 'Helvetica' : font === 'times' ? 'Times' : 'Courier',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  authorName: {
    fontSize: 10,
    color: secondaryTextColor,
    fontFamily: font === 'helvetica' ? 'Helvetica' : font === 'times' ? 'Times' : 'Courier',
    position: 'absolute',
    bottom: 20,
    right: 40,
  },
  pageNumber: {
    fontSize: 10,
    color: secondaryTextColor,
    fontFamily: font === 'helvetica' ? 'Helvetica' : font === 'times' ? 'Times' : 'Courier',
    position: 'absolute',
    bottom: 20,
    left: 40,
  },
});

const PDFSlide = ({ page, index, totalPages, authorName, showPageNumbers, styles }) => {
  const hasTitle = page.title && page.title.trim() !== '';

  return (
    <Page size={[595, 595]} style={styles.page}>
      {hasTitle ? (
        <>
          <Text style={styles.title}>{page.title}</Text>
          <Text style={styles.content}>{page.content}</Text>
        </>
      ) : (
        <Text style={styles.contentWithoutTitle}>{page.content}</Text>
      )}
      
      {showPageNumbers && (
        <Text style={styles.pageNumber}>
          {index + 1} / {totalPages}
        </Text>
      )}
      <Text style={styles.authorName}>{authorName}</Text>
    </Page>
  );
};

const PDFDocument = ({ pages, authorName, backgroundColor, font, showPageNumbers, textColor, secondaryTextColor }) => {
  const styles = createStyles(backgroundColor, textColor, secondaryTextColor, font);

  return (
    <Document>
      {pages.map((page, index) => (
        <PDFSlide
          key={index}
          page={page}
          index={index}
          totalPages={pages.length}
          authorName={authorName}
          showPageNumbers={showPageNumbers}
          styles={styles}
        />
      ))}
    </Document>
  );
};

export default PDFDocument;