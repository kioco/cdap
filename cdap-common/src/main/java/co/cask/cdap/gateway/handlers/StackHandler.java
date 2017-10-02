/*
 * Copyright © 2017 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

package co.cask.cdap.gateway.handlers;

import co.cask.cdap.common.conf.Constants;
import co.cask.http.AbstractHttpHandler;
import co.cask.http.HttpResponder;
import org.jboss.netty.handler.codec.http.HttpRequest;
import org.jboss.netty.handler.codec.http.HttpResponseStatus;

import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

/**
 * Returns information about threads, including their stack traces.
 */
public class StackHandler extends AbstractHttpHandler {

  private static final ThreadMXBean THREAD_MX_BEAN = ManagementFactory.getThreadMXBean();
  private static final int STACK_DEPTH = 20;

  @Path(Constants.Gateway.API_VERSION_3 + "/system/services/{service-name}/stacks")
  @GET
  public void stacks(HttpRequest request, HttpResponder responder) {
    // ignore the service-name, since we dont need it. its only used for routing
    responder.sendString(HttpResponseStatus.OK, getThreadInfo());
  }

  /**
   * Print all of the thread's information and stack traces.
   */
  private synchronized String getThreadInfo() {
    boolean contention = THREAD_MX_BEAN.isThreadContentionMonitoringEnabled();
    long[] threadIds = THREAD_MX_BEAN.getAllThreadIds();
    StringBuilder stringBuilder = new StringBuilder();
    println(stringBuilder, "Process Thread Dump:");
    println(stringBuilder, threadIds.length + " active threads");
    for (long tid : threadIds) {
      ThreadInfo info = THREAD_MX_BEAN.getThreadInfo(tid, STACK_DEPTH);
      if (info == null) {
        println(stringBuilder, "  Inactive");
        continue;
      }
      println(stringBuilder, "Thread " +
                       getTaskName(info.getThreadId(), info.getThreadName()) + ":");
      Thread.State state = info.getThreadState();
      println(stringBuilder, "  State: " + state);
      println(stringBuilder, "  Blocked count: " + info.getBlockedCount());
      println(stringBuilder, "  Waited count: " + info.getWaitedCount());
      if (contention) {
        println(stringBuilder, "  Blocked time: " + info.getBlockedTime());
        println(stringBuilder, "  Waited time: " + info.getWaitedTime());
      }
      if (state == Thread.State.WAITING) {
        println(stringBuilder, "  Waiting on " + info.getLockName());
      } else if (state == Thread.State.BLOCKED) {
        println(stringBuilder, "  Blocked on " + info.getLockName());
        println(stringBuilder, "  Blocked by " +
                         getTaskName(info.getLockOwnerId(), info.getLockOwnerName()));
      }
      println(stringBuilder, "  Stack:");
      for (StackTraceElement frame : info.getStackTrace()) {
        println(stringBuilder, "    " + frame.toString());
      }
    }
    return stringBuilder.toString();
  }

  private void println(StringBuilder stringBuilder, String toAppend) {
    stringBuilder.append(toAppend).append("\n");
  }

  private String getTaskName(long id, String name) {
    if (name == null) {
      return Long.toString(id);
    }
    return id + " (" + name + ")";
  }
}
