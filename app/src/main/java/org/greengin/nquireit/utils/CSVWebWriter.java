package org.greengin.nquireit.logic.csv;

/**
 * A thin wrapper around OpenCSV to media the HTTP response, and allow individual CSV "cells" to be written.
 *
 * @author  Nick Freear, 15 February 2017.
 */


/// QUESTION ~ Can the methods below safely be "static" ??!!


import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.util.*;

import com.opencsv.CSVWriter;

public class CSVWebWriter extends CSVWriter {

    protected static Writer pw;
    protected static HttpServletResponse response;

    protected List<String> cells;

    public CSVWebWriter(Writer writer, char separator) {
        super(writer, separator);
    }

    /** Simple setup utility method.
    */
    public static CSVWebWriter open(HttpServletResponse response, long dataId) throws IOException {
        bind(response, dataId);

        CSVWebWriter.pw = new PrintWriter(response.getOutputStream());
        return new CSVWebWriter(pw, DEFAULT_SEPARATOR);
    }

    public static HttpServletResponse bind(HttpServletResponse response, long dataId) {
        CSVWebWriter.response = response;

        response.setContentType("text/csv");  // RFC 7111 (RFC 4180).
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-Disposition", String.format("attachment; filename=\"%d.csv\"", dataId));
        //response.setHeader("Content-Disposition", String.format("inline; filename=\"%d.csv\"", projectId));
        return response;
    }

    public void writeCell(String cell) {
        tryStartLine();
        cells.add(cell);
    }

    public void writeFloat(Float cell) {
        tryStartLine();
        cells.add(Float.toString(cell));
    }

    public void writeDate(Date cell) {
        tryStartLine();
        cells.add(cell.toString());
    }

    /* [ERROR]
    /Users/Nick/workspace/nquire/nquire-web-source/app/src/main/java/org/greengin/nquireit/controllers/activities/senseit/SenseItDataController.java:[103,28]
      reference to writeCell is ambiguous, both method writeCell(java.lang.String) in
      org.greengin.nquireit.logic.data.CSVWebWriter and method writeCell(java.util.Date) in
      org.greengin.nquireit.logic.data.CSVWebWriter match
    */

    private void tryStartLine() {
        if (null == this.cells) {
            this.cells = new ArrayList<String>();
        }
    }

    public void writeNext() throws IOException {
        if (null == this.cells) {
            throw new IOException("No cells found.");
        }
        String[] line = new String[ cells.size() ];
        cells.toArray(line);
        this.writeNext(line);

        // Implicitly delete!
        this.cells = null;
    }

    @Override
    public void close() throws IOException {
        this.close();
        CSVWebWriter.pw.close();
    }
}
