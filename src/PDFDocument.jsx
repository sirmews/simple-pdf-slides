import React from 'react';
import { Document, Page, Text, StyleSheet, Font, Image, View } from '@react-pdf/renderer';
import { getContrastTextColor } from './utils/colorUtils';

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

// Register emoji source for image-based emoji rendering
Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
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

const PDFSlide = ({ page, index, totalPages, authorName, showPageNumbers, styles, font }) => {
  const hasTitle = page.title && page.title.trim() !== '';
  const hasContent = page.content && page.content.trim() !== '';
  const template = page.template || 'simple';
  
  // Calculate text colors for this slide's background
  const slideBackgroundColor = page.backgroundColor;
  const slideTextColor = getContrastTextColor(slideBackgroundColor);
  const slideSecondaryTextColor = slideTextColor === "#ffffff" ? "#e2e8f0" : "#64748b";
  
  // Create styles with this slide's colors
  const slidePageStyle = {
    ...styles.page,
    backgroundColor: slideBackgroundColor,
  };
  
  const slideTitleStyle = {
    ...styles.title,
    color: slideTextColor,
  };
  
  const slideContentStyle = {
    ...styles.content,
    color: slideTextColor,
  };
  
  const slideContentWithoutTitleStyle = {
    ...styles.contentWithoutTitle,
    color: slideTextColor,
  };
  
  const slideAuthorStyle = {
    ...styles.authorName,
    color: slideSecondaryTextColor,
  };
  
  const slidePageNumberStyle = {
    ...styles.pageNumber,
    color: slideSecondaryTextColor,
  };

  // Render based on template
  const renderSimpleTemplate = () => (
    <>
      {hasTitle ? (
        <>
          <Text style={slideTitleStyle}>{page.title}</Text>
          {page.image && (
            <Image 
              src={page.image} 
              style={{
                maxWidth: 300,
                maxHeight: 200,
                marginVertical: 20,
                objectFit: 'contain',
                alignSelf: 'center',
              }}
            />
          )}
          {hasContent && <Text style={slideContentStyle}>{page.content}</Text>}
        </>
      ) : (
        <>
          {page.image && (
            <Image 
              src={page.image} 
              style={{
                maxWidth: 350,
                maxHeight: 250,
                marginVertical: 20,
                objectFit: 'contain',
                alignSelf: 'center',
              }}
            />
          )}
          {hasContent && <Text style={slideContentWithoutTitleStyle}>{page.content}</Text>}
        </>
      )}
    </>
  );

  const renderSplitTemplate = () => (
    <View style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    }}>
      {/* Left Column - Text Content */}
      <View style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingRight: 20,
      }}>
        {hasTitle && (
          <Text style={{
            ...slideTitleStyle, 
            textAlign: 'left', 
            marginBottom: 15,
            fontSize: 28,
          }}>
            {page.title}
          </Text>
        )}
        {hasContent && (
          <Text style={{
            ...slideContentStyle,
            textAlign: 'left',
            fontSize: font === 'courier' ? 16 : 18,
            lineHeight: 1.5,
          }}>
            {page.content}
          </Text>
        )}
      </View>
      
      {/* Right Column - Image */}
      <View style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {page.image && (
          <Image 
            src={page.image} 
            style={{
              maxWidth: 250,
              maxHeight: 300,
              objectFit: 'contain',
            }}
          />
        )}
      </View>
    </View>
  );

  return (
    <Page size={[595, 595]} style={slidePageStyle}>
      {template === 'split' ? renderSplitTemplate() : renderSimpleTemplate()}
      
      {showPageNumbers && (
        <Text style={slidePageNumberStyle}>
          {index + 1} / {totalPages}
        </Text>
      )}
      <Text style={slideAuthorStyle}>{authorName}</Text>
    </Page>
  );
};

const PDFDocument = ({ pages, authorName, font, showPageNumbers, backgroundColor = "#e0f2fe", textColor = "#1f2937", secondaryTextColor = "#64748b" }) => {
  // Create default styles - these are only used as fallbacks since each slide calculates its own colors
  const defaultStyles = createStyles(backgroundColor, textColor, secondaryTextColor, font);

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
          styles={defaultStyles}
          font={font}
        />
      ))}
    </Document>
  );
};

export default PDFDocument;