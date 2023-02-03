<h1><a id="user-content-shape" class="anchor" aria-hidden="true" href="#shape"><span aria-hidden="true" class="octicon octicon-link"></span></a>Shape</h1>
<p>This will draw a shape on the canvas!</p>
<h2><a id="user-content-usage" class="anchor" aria-hidden="true" href="#usage"><span aria-hidden="true" class="octicon octicon-link"></span></a>Usage</h2>
<div class="highlight highlight-source-ts"><pre><span class="pl-k">import</span> <span class="pl-kos">{</span> <span class="pl-smi">Shape</span> <span class="pl-kos">}</span> <span class="pl-k">from</span> <span class="pl-s">'@ngx-canvas/core'</span><span class="pl-kos">;</span>

<span class="pl-k">const</span> <span class="pl-s1">shape</span> <span class="pl-c1">=</span> <span class="pl-k">new</span> <span class="pl-smi">Shape</span><span class="pl-kos">(</span><span class="pl-kos">{</span><span class="pl-kos">}</span>: <span class="pl-smi">SHAPE</span><span class="pl-kos">)</span><span class="pl-kos">;</span>

<span class="pl-s1">shape</span><span class="pl-kos">.</span><span class="pl-en">apply</span><span class="pl-kos">(</span><span class="pl-kos">)</span><span class="pl-kos">;</span></pre></div>
<h3><a id="user-content-inputs" class="anchor" aria-hidden="true" href="#inputs"><span aria-hidden="true" class="octicon octicon-link"></span></a>Inputs</h3>
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
<h3><a id="user-content-outputs" class="anchor" aria-hidden="true" href="#outputs"><span aria-hidden="true" class="octicon octicon-link"></span></a>Outputs</h3>
