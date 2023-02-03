<h1><a id="user-content-column" class="anchor" aria-hidden="true" href="#column"><span aria-hidden="true" class="octicon octicon-link"></span></a>
<a id="user-content-column" href="#column"><span></span></a>Column</h1>
<p>This will draw a column on the canvas!</p>
<h2><a id="user-content-usage" class="anchor" aria-hidden="true" href="#usage"><span aria-hidden="true" class="octicon octicon-link"></span></a>
<a id="user-content-usage" href="#usage"><span></span></a>Usage</h2>
<div><pre><span>import</span> <span>{</span> <span>Column</span> <span>}</span> <span>from</span> <span>'@ngx-canvas/core'</span><span>;</span>
<p><span>const</span> <span>column</span> <span>=</span> <span>new</span> <span>Column</span><span>(</span><span>{</span><span>}</span>: <span>SHAPE</span><span>)</span><span>;</span></p>
<p><span>column</span><span>.</span><span>apply</span><span>(</span><span>)</span><span>;</span></p></pre></div>
<h3><a id="user-content-inputs" class="anchor" aria-hidden="true" href="#inputs"><span aria-hidden="true" class="octicon octicon-link"></span></a>
<a id="user-content-inputs" href="#inputs"><span></span></a>Inputs</h3>
<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Default</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>id</td>
<td>string</td>
<td>ObjectId()</td>
<td>Optional</td>
<td></td>
</tr>
<tr>
<td>fill</td>
<td>Fill</td>
<td>new Fill()</td>
<td>Optional</td>
<td></td>
</tr>
<tr>
<td>font</td>
<td>Font</td>
<td>new Font()</td>
<td>Optional</td>
<td></td>
</tr>
<tr>
<td>data</td>
<td>any</td>
<td>{}</td>
<td>Optional</td>
<td></td>
</tr>
<tr>
<td>type</td>
<td>string</td>
<td>'rectangle'</td>
<td>Optional</td>
<td></td>
</tr>
<tr>
<td>name</td>
<td>string</td>
<td>''</td>
<td>Optional</td>
<td></td>
</tr>
<tr>
<td>stroke</td>
<td>Stroke</td>
<td>new Stroke()</td>
<td>Optional</td>
<td></td>
</tr>
<tr>
<td>hidden</td>
<td>boolean</td>
<td>false</td>
<td>Optional</td>
<td></td>
</tr>
<tr>
<td>selected</td>
<td>boolean</td>
<td>false</td>
<td>Optional</td>
<td></td>
</tr>
<tr>
<td>dragging</td>
<td>boolean</td>
<td>false</td>
<td>Optional</td>
<td></td>
</tr>
<tr>
<td>position</td>
<td>Position</td>
<td>new Position()</td>
<td>Optional</td>
<td></td>
</tr>
<tr>
<td>children</td>
<td>Shape[]</td>
<td>[]</td>
<td>Optional</td>
<td></td>
</tr>
<tr>
<td>conditions</td>
<td>any[]</td>
<td>[]</td>
<td>Optional</td>
<td></td>
</tr>
<tr>
<td>-------------</td>
<td>-----------</td>
<td>-----------------</td>
<td>-----------</td>
<td>-------------</td>
</tr>
</tbody>
</table>
<h3><a id="user-content-outputs" class="anchor" aria-hidden="true" href="#outputs"><span aria-hidden="true" class="octicon octicon-link"></span></a>
<a id="user-content-outputs" href="#outputs"><span></span></a>Outputs</h3>
