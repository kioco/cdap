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

package co.cask.cdap.internal.app.runtime.schedule.trigger;

import co.cask.cdap.api.schedule.StreamSizeTriggerInfo;

import java.io.Serializable;

/**
 * The stream size trigger information to be passed to the triggered program.
 */
public class DefaultStreamSizeTriggerInfo extends AbstractTriggerInfo implements StreamSizeTriggerInfo, Serializable {

  private final String streamNamespace;
  private final String streamName;
  private final int triggerMB;
  private final long streamSize;
  private final long basePollingTime;
  private final long baseStreamSize;

  public DefaultStreamSizeTriggerInfo(String streamNamespace, String streamName, int triggerMB,
                                      long streamSize, long basePollingTime, long baseStreamSize) {
    super(Type.STREAM_SIZE);
    this.streamNamespace = streamNamespace;
    this.streamName = streamName;
    this.triggerMB = triggerMB;
    this.streamSize = streamSize;
    this.basePollingTime = basePollingTime;
    this.baseStreamSize = baseStreamSize;
  }

  @Override
  public String getStreamNamespace() {
    return streamNamespace;
  }

  @Override
  public String getStreamName() {
    return streamName;
  }

  @Override
  public int getTriggerMB() {
    return triggerMB;
  }

  @Override
  public long getStreamSize() {
    return streamSize;
  }

  @Override
  public long getBasePollingTime() {
    return basePollingTime;
  }

  @Override
  public long getBaseStreamSize() {
    return baseStreamSize;
  }
}
