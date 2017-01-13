<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/vcard">
        <HTML>
            <HEAD>
                <TITLE>Business card</TITLE>
                <link rel="stylesheet" type="text/css" href="xml/vcard.css" />
            </HEAD>
            <BODY>
                <H1>Business card</H1>
                <table class="tb">
                    <tr>
                        <td>Name</td>
                        <td>
                            <xsl:value-of select="name"/>
                        </td>
                    </tr>
                    <tr>
                        <td>E-mail</td>
                        <td>
                            <xsl:value-of select="email"/>
                        </td>
                    </tr>
                    <tr>
                        <td>Phone number</td>
                        <td>
                            <xsl:value-of select="phone"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <xsl:element name="a">
                                <xsl:attribute name="href">
                                    <xsl:value-of select="homeworks"/>
                                </xsl:attribute>
                                Homeworks
                            </xsl:element>
                        </td>
                    </tr>
                </table>
            </BODY>
        </HTML>
    </xsl:template>
</xsl:stylesheet>